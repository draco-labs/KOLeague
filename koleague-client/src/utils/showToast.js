import toast, { Toaster } from 'react-hot-toast';

const showToast = {
    success: (message1, message2 = '') => {
        toast.success(
            <div class="self-stretch justify-start items-center flex-col gap-2 inline-flex !m-0">
                <div className='text-foreground text-sm font-medium text-[#FAFAFA]'>{message1}</div>
                {message2 && <div className='self-stretch opacity-90 text-zinc-50 text-xs font-medium text-[#FAFAFA] leading-tight'>{message2}</div>}
            </div>, 
            {
                position: "bottom-right",
                className: "toast-success",
                icon: null,
                duration: 300000,
                style: {
                    backgroundColor: '#09090b',
                }
            }
        );
    },
    error: (message1, message2 = '', buttonText= '') => {
        toast.error(
            <div class="self-stretch justify-between items-center gap-4 flex whitespace-nowrap ">
                <span className='absolute top-[6px] right-2 text-[#FAFAFA] cursor-pointer'onClick={() => {
                const toastElement = document.querySelector('.toast-error'); // Lấy phần tử toast
                if (toastElement) {
                  toastElement.classList.add('toast-closing'); // Thêm lớp 'toast-closing' để kích hoạt animation
                  setTimeout(() => {
                    toast.dismiss(); 
                  }, 100);
                }
            }}>⨉</span>
                <div class="self-stretch justify-start items-center flex-col gap-2 inline-flex ">
                   <div className='w-full text-foreground text-sm font-medium text-[#FAFAFA] leading-3'>{message1}</div>
                  {message2 && <div className='self-stretch text-xs font-medium text-[#FAFAFA] leading-tight'>{message2}</div>}
                </div>
                {buttonText && <div className="py-1 px-3 rounded-md border border-foreground justify-center items-center gap-2.5 flex cursor-pointer" onClick={() => {
                const toastElement = document.querySelector('.toast-error'); // Lấy phần tử toast
                if (toastElement) {
                  toastElement.classList.add('toast-closing'); // Thêm lớp 'toast-closing' để kích hoạt animation
                  setTimeout(() => {
                    toast.dismiss(); // Sau 0.5s (thời gian animation), xóa toast
                  }, 100);
                }
            }}>
                    <div className="text-destructive-foreground text-sm font-medium text-[#FAFAFA] leading-normal">{buttonText}</div>
                </div>}
            </div>,
            {
                position: "bottom-right",
                className: "toast-error",
                icon: null,
                duration: 300000,
                style: {
                    backgroundColor: '#7f1d1d',
                },
                onClose: () => {
                    const toastElement = document.querySelector('.toast-error');
                    if (toastElement) {
                        toastElement.classList.add('toast-closing');
                    }
                }
            }
        );
    }
};

export default showToast;