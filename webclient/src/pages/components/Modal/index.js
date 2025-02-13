import React from 'react';
import ReactDOM from 'react-dom';
import close from "../../../assets/images/close.svg"

const Modal = ({
  open, 
  title,
  children,
  handleCancel,
  key,
  className = 'w-[90%] sm:w-1/2 md:w-1/3 lg:w-1/4',
  closed = false
}) => {
  if (typeof window === 'object') {
    // Check if document is finally loaded
    return ReactDOM.createPortal(
      <React.Fragment>
        {open && (
          <div className="fixed w-screen h-screen left-0 right-0 bottom-0 top-0 flex justify-center items-center z-[1000] text-[#FAFAFA]">
            <div
              className="bg-modal absolute top-0 left-0 right-0 bottom-0 h-full w-full z-50"
               onClick={() => handleCancel && handleCancel()}
            />
            <div className={` shadow-md max-h-full overflow-y-scroll z-[60] ${className}`}>
              <div className="flex justify-between">
                <p className="sm:text-[24px] font-semibold text-[2px]">{title}</p>
                {closed ? <div className=' cursor-pointer' onClick={() =>  handleCancel && handleCancel()}>
                  <img className='w-6 h-6' src={close.src}/>
                </div> : ''}
              </div>
              <div className="">
                {typeof children === 'string' ? (
                  <p className="sm:text-medium">{children}</p>
                ) : (
                  children
                )}
              </div>
            </div>
          </div>
        )}
      </React.Fragment>,
      document.body,
      key
    )
  }
  return null
}

export default Modal
