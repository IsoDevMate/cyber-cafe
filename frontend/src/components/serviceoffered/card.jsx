import { useNavigate } from "react-router-dom";

const ServiceCard = ({ avatar, title, subtitle, id }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/queue`);
  };

  return (
    <>
      <div
        className="sm:w-1/4 lg:w-1/8 flex justify-center items-center flex-col gap-2 bg-white rounded-lg shadow-lg p-4 m-4"
        onClick={handleClick}
      >
        <div className="w-12 h-12 rounded-full bg-gray-900 shadow-md shadow-slate-200 flex justify-center items-center">
          {avatar && (
            <img
              src={avatar}
              alt={title}
              className="w-full h-full rounded-full object-cover"
            />
          )}
        </div>
        <p className="text-center mt-2 font-semibold text-xs leading-5">
          {title}
        </p>
        <p className="text-[10px] text-center text-gray-600">{subtitle}</p>
      </div>
    </>
  );
};

export default ServiceCard;