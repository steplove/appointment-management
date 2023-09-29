import Swal from 'sweetalert2';

export function useAlert() {
  const showAlert = (options) => {
    Swal.fire(options);
  };

  return {
    showAlert
  };
}
