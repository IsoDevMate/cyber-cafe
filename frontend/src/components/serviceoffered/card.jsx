import { useNavigate } from "react-router-dom"

const ServiceCard = ({ icon, title, subtitle, id }) => {
    const navigate = useNavigate()
    const handleClick = () => {
        navigate(`/queue`)
    }
  return (
    <>
      <div className='sm:w-1/4 lg:w-1/8 flex justify-center items-center flex-col gap-2' onClick={handleClick}>
        <div className='w-12 h-12 rounded-full bg-gray-900 shadow-md shadow-slate-200 flex justify-center items-center'>
          {id && (
            <div className='text-primary-color  w-10 h-10 bg-[#061426] rounded-full text-2xl font-bold flex justify-center items-center'>
              {id}
            </div>
          )}
          {icon && (
            <img
              src={icon}
              alt={title}
              className='w-6 h-6 object-cover object-center'
            />
          )}
        </div>
        <p className='text-center mt-2 font-semibold text-xs leading-5'>
          {title}
        </p>
        <p className='text-[10px] text-center text-gray-600'>{subtitle}</p>
      </div>
    </>
  )
}

export default ServiceCard