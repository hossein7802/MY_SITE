document.addEventListener('alpine:init', () => {
    Alpine.data('mainData', () => (
        {
            message: 'I Love Programming',
            names: ['qasem', 'abbas', 'nima'],
            testFunc() {
                alert(this.message)
            }
        }))
})