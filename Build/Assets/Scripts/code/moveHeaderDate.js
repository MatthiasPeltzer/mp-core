const dateWrapper = document.querySelector('.date-wrapper');
const headerContent = document.getElementById('headerMain');

// Check if both elements exist before attempting to move dateWrapper
if (dateWrapper && headerContent) {
  headerContent.insertAdjacentElement('afterend', dateWrapper);
}
