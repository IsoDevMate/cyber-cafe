import {  NavLink, useNavigate } from 'react-router-dom';
import ServiceCard from './card.jsx';

export const Services = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/queue`);e
  };

  return (
    <div>
      <div>
        <h2 className='text-center'>WELCOME TO CYBER-CAFE</h2>
        <h3 className='text-center'>Choose your service </h3>
      </div>
      <div>
        <div className='flex flex-row flex-wrap  my-8 gap-8 mx-auto justify-center'>
          {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </div>
  )
};

export default Services;


const services = [
  {
    id: 1,
    title: 'Servicing LapTop',
    icon: '',
    subtitle:
      'lorem ipsum dolor sit amet consectetur adipisicing elit loremlorem ipsum dolor sit amet consectetur adipisicing elit lo',
  },
  {
    id: 2,
    title: 'VPN configuration and Remote Configuration',
    icon: '',
    subtitle:
      'lorem ipsum dolor sit amet consectetur adipisicing elit loremlorem ipsum dolor sit amet consectetur adipisicing elit lo',
  },
  {
    id: 3,
    title: 'Hosting And Cloud Services',
    icon: '',
    subtitle:
      'lorem ipsum dolor sit amet consectetur adipisicing elit loremlorem ipsum dolor sit amet consectetur adipisicing elit lo',
  },
  {
    id: 4,
    title: 'Data Recovery Services',
    icon: '',
    subtitle:
      'lorem ipsum dolor sit amet consectetur adipisicing elit loremlorem ipsum dolor sit amet consectetur adipisicing elit lo',
  },
  {
    id: 5,
    title: 'Browsing and  Tunnelling services AWS VPCs',
    icon: '',
    subtitle:
      'lorem ipsum dolor sit amet consectetur adipisicing elit loremlorem ipsum dolor sit amet consectetur adipisicing elit lo',
  },
]