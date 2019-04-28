const AuthenticatedHelper = require('./helpers/Authenticated');

class AccountsController extends AuthenticatedHelper {
    /* 
     * get /accounts
     */
    async index(){
        const accounts = await this.state.currentOrganization.accounts.where({archived: false})
        return await this.render({
            body: accountsSerializer.accounts(accounts),
            status: 200
        })
    }

    /* 
     * get /accounts/:id
     */
    async show(){
        const account = await this.currentAccount()
        return await this.render({
            body: accountsSerializer.account(account),
            status: 200
        })
    }

    /* 
     * create /accounts
     */
    async create(){
        const account = await this.state.currentOrganization.accounts.create(
            this.accountParams
        )
        return await this.render({
            body: accountsSerializer.account(account),
            status: 200
        })
    }

    /* 
     * put /accounts/id
     */
    async update(){
        const account = await this.currentAccount()
        
        account.update(
            this.accountParams
        )

        return await this.render({
            body: accountsSerializer.account(account),
            status: 200
        })
    }

    /* 
     * delete /accounts/id
     */
    async destroy(){
        const account = await this.currentAccount()
        account.archive()

        return await this.render({
            body: accountsSerializer.account(account),
            status: 200
        })
    }

    get accountParams(){
        return strongParams.account(this.params)
    }

    async currentAccount(){
        return this.fetch('account', async()=>{
            return await this.state.currentOrganization.accounts.findBy({'accounts.id': this.id})
        })
    }
    get id(){
        return strongParams.id(this.params)
    }
}


module.exports = AccountsController