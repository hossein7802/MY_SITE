document.addEventListener('alpine:init', () => {
    Alpine.data('usersData', () => ({
        mainUsers: [],
        users: [],
        pageUsers: [],
        isLoading: false,
        showAddModal: false,
        pageCount: 1,
        itemsCount: 4,
        currentPage: 1,
        searchChar: "",
        newUserInfo: {
            name: "",
            username: "",
            email: "",
        },
        getUsers() {
            this.isLoading = true
            axios.get("https://jsonplaceholder.typicode.com/users").then((res) => {
                this.mainUsers = res.data
                this.users = res.data
                this.pagination()
            }).finally(() => {
                this.isLoading = false
            })
        },
        pagination() {
            this.pageCount = Math.ceil(this.users.length / this.itemsCount)   //   10 / 4 = 3
            const start = (this.currentPage * this.itemsCount) - this.itemsCount   //   0
            const end = this.currentPage * this.itemsCount   //   4
            this.pageUsers = this.users.slice(start, end)
            console.log(this.pageUsers);
        },
        nextPage() {
            this.currentPage++
            if (this.currentPage > this.pageCount) this.currentPage = this.pageCount
            this.pagination()
        },
        prevPage() {
            this.currentPage--
            if (this.currentPage < 1) this.currentPage = 1
            this.pagination()
        },
        handleChangeItemsCount(value) {
            this.currentPage = 1
            if (value < 1) this.itemsCount = 1
            if (value > this.users.length) this.itemsCount = this.users.length
        },
        handleSearch(value) {
            this.users = this.mainUsers.filter(user => (user.name.includes(value) || user.username.includes(value) || user.email.includes(value)))
            this.currentPage = 1
            this.pagination()
        },
        handleSubmitAddUserForm() {
            this.isLoading = true
            axios.post("https://jsonplaceholder.typicode.com/users", this.newUserInfo).then((res) => {
                if (res.status === 201) {
                    this.mainUsers.push(res.data)
                    this.showAddModal = false
                    this.handleResetForm()
                    this.pagination()
                    M.toast({ html: 'User Created Successfully !', classes: 'green' });
                }
            }).finally(() => {
                this.isLoading = false
            })
        },
        handleResetForm() {
            this.newUserInfo = {
                name: "",
                username: "",
                email: "",
            }
        },
        handleDeleteUser(userId) {
            var toastHTML = '<span>Are You Sure ? (' + userId + ')</span><button class="btn-flat toast-action" x-on:click="handleConfirmDeleteUser(' + userId + ')">Delete</button>';
            M.toast({ html: toastHTML });
        },
        handleConfirmDeleteUser(userId) {
            this.isLoading = true
            axios.delete("https://jsonplaceholder.typicode.com/users/" + userId).then((res) => {
                if (res.status === 200) {
                    this.mainUsers = this.mainUsers.filter(user => user.id != userId)
                    this.users = this.users.filter(user => user.id != userId)
                    this.pagination()
                    M.toast({ html: 'User Delete Successfully !', classes: 'red' });
                }
            }).finally(() => {
                this.isLoading = false
            })
        }
    }))
})