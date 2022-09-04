const javascript = `
<script>
const tabs = document.querySelectorAll('[data-tab-value]');
const tabInfos = document.querySelectorAll('[data-tab-info]');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document
            .querySelector(tab.dataset.tabValue);

        tabs.forEach(tab => {
            tab.classList.remove('tab-clicked')
        })
        tabInfos.forEach(tabInfo => {
            tabInfo.classList.remove('active')
        })
        target.classList.add('active');
        tab.classList.add('tab-clicked');
    })
});
</script>`;

module.exports = {javascript}