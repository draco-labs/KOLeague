import nodata from '../../assets/images/nodata.svg';

const NoData = () => {
  return <div className="w-full text-center py-32">
    <img src={nodata.src} className='mb-4 mx-auto' />
    <div>
      <div className='mb-2'>No Data Here!</div>
      <div>Please try again.</div>
    </div>
  </div>
}

export default NoData;