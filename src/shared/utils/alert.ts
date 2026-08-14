import Swal from 'sweetalert2';

// Custom TiketinAja styled SweetAlert instance
export const customSwal = Swal.mixin({
  customClass: {
    popup: 'rounded-3xl shadow-2xl p-6 sm:p-8 font-sans border border-slate-100',
    title: 'text-xl sm:text-2xl font-black text-gray-900 tracking-tight',
    htmlContainer: 'text-sm sm:text-base text-gray-600 leading-relaxed mt-2',
    confirmButton:
      'bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md shadow-blue-500/20 transition-all mx-1 cursor-pointer',
    cancelButton:
      'bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-xl text-sm transition-all mx-1 cursor-pointer',
    denyButton:
      'bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition-all mx-1 cursor-pointer',
  },
  buttonsStyling: false,
  background: '#ffffff',
});

// Toast notification preset
export const toastSwal = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: 'rounded-2xl shadow-xl p-3 font-sans border border-slate-100/80',
    title: 'text-sm font-bold text-gray-900',
  },
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

export const showAlert = {
  success: (title: string, text?: string) => {
    return customSwal.fire({
      icon: 'success',
      title,
      text,
      iconColor: '#10B981',
      confirmButtonText: 'Oke, Mengerti',
    });
  },

  error: (title: string, text?: string) => {
    return customSwal.fire({
      icon: 'error',
      title,
      text,
      iconColor: '#EF4444',
      confirmButtonText: 'Tutup',
    });
  },

  warning: (title: string, text?: string) => {
    return customSwal.fire({
      icon: 'warning',
      title,
      text,
      iconColor: '#F59E0B',
      confirmButtonText: 'Lanjutkan',
    });
  },

  info: (title: string, text?: string) => {
    return customSwal.fire({
      icon: 'info',
      title,
      text,
      iconColor: '#0064D2',
      confirmButtonText: 'Mengerti',
    });
  },

  confirm: async ({
    title,
    text,
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    icon = 'question',
    isDanger = false,
  }: {
    title: string;
    text?: string;
    confirmText?: string;
    cancelText?: string;
    icon?: 'question' | 'warning' | 'info';
    isDanger?: boolean;
  }): Promise<boolean> => {
    const result = await customSwal.fire({
      icon,
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      iconColor: isDanger ? '#EF4444' : '#0064D2',
      customClass: {
        popup: 'rounded-3xl shadow-2xl p-6 sm:p-8 font-sans border border-slate-100',
        title: 'text-xl sm:text-2xl font-black text-gray-900 tracking-tight',
        htmlContainer: 'text-sm sm:text-base text-gray-600 leading-relaxed mt-2',
        confirmButton: isDanger
          ? 'bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition-all mx-1 cursor-pointer'
          : 'bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md shadow-blue-500/20 transition-all mx-1 cursor-pointer',
        cancelButton:
          'bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-xl text-sm transition-all mx-1 cursor-pointer',
      },
      buttonsStyling: false,
    });
    return result.isConfirmed;
  },
};

export const showToast = {
  success: (title: string) => {
    return toastSwal.fire({
      icon: 'success',
      title,
      iconColor: '#10B981',
    });
  },
  error: (title: string) => {
    return toastSwal.fire({
      icon: 'error',
      title,
      iconColor: '#EF4444',
    });
  },
  info: (title: string) => {
    return toastSwal.fire({
      icon: 'info',
      title,
      iconColor: '#0064D2',
    });
  },
  warning: (title: string) => {
    return toastSwal.fire({
      icon: 'warning',
      title,
      iconColor: '#F59E0B',
    });
  },
};
