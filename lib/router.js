const router = require('find-my-way')

const Router = (...args)=> {
    const r = router(...args)
    r.resource = (route, controller)=>{
        if(route[0] !== '/') route = `/${route}`

        r.get(route + '/:id', async (...args)=>{
            (new controller(...args, 'show')).show()
        })
        r.get(route, async (...args)=>{
            (new controller(...args, 'index')).index()
        })
        r.post(route, async (...args)=>{
            (new controller(...args, 'create')).create()
        })
        r.put(route + '/:id', async (...args)=>{
            (new controller(...args, 'update')).update()
        })
        r.delete(route + '/:id', async (...args)=>{
            (new controller(...args, 'destroy')).destroy()
        })
    }
    return r;
}

module.exports = Router