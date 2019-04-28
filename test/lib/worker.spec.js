const test = require('../specHelper');

const { mountWorker, Worker, Supervisor } = require('lib/worker')

test.serial('Worker Test', async (t)=>{
    class TestWorker extends Worker{
        static get workerName(){
            return 'Test Worker'
        }
        
        async work(){
            t.is(this.props.actionData, 'test')
        }
        
    }
    
    const testWorker = mountWorker(TestWorker)
    testWorker.dispatch({
        actionData: 'test'
    })
})

test.serial('Worker Test inner Dispatch Test', async (t)=>{
    class TestWorkerOne extends Worker{
        static get workerName(){
            return 'TestWorkerOne'
        }
        
        async work(){
            t.is(this.props.actionData, 'test')
        }
        
    }
    const testWorkerOne = mountWorker(TestWorkerOne)

    class TestWorkerTwo extends Worker{
        static get workerName(){
            return 'TestWorkerTwo'
        }
        
        async work(){
            this.dispatch({
                workerName: 'TestWorkerOne',
                ...this.props
            })
        }
        
    }
    const testWorkerTwo = mountWorker(TestWorkerTwo)

    testWorkerTwo.dispatch({
        actionData: 'test'
    })
})

test.serial('Worker Test Progress Test', async (t)=>{
    class TestWorkerOne extends Worker{
        static get workerName(){
            return 'TestWorkerProgress'
        }
        
        async work(){
            this.setProgress(20)
        }
        
    }
    const testWorkerOne = mountWorker(TestWorkerOne)

    testWorkerOne.dispatch({
        actionData: 'test'
    })

    const a = new Supervisor('TestWorkerProgress')
    
    t.is(a.bull.constructor.queues.TestWorkerProgress.progress, 20)
})

test.serial('Worker Test Get Set Test', (t)=>{
    return new Promise(async(resolve, reject)=>{

        class TestWorkerOne extends Worker{
            static get workerName(){
                return 'TestWorkerProgressGetSet'
            }
            
            async work(){
                await this.set('account', {firstName: 'Carson'})
                const account = await this.get('account')
                
                t.is(account.firstName, 'Carson')
                resolve()
            }
            
        }
        const testWorkerOne = mountWorker(TestWorkerOne)
        
        await testWorkerOne.dispatch({
            actionData: 'test'
        })
    })
})