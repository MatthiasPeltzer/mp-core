const dateWrapper = document.querySelector('.date-wrapper');
const headerContent = document.getElementById('headerMain');

if (dateWrapper && headerContent) {
  headerContent.insertAdjacentElement('afterend', dateWrapper);
}
