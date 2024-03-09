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
        <h2 className='text-center font-bold'>WELCOME TO CYBER-CAFE</h2>
        <h3 className='text-center font-semi-bold'>Choose your service </h3>
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



const services = [
  {
    id: 1,
    title: 'Meet AutoManage, the best AI management tools',
    icon: '',
    subtitle:
      'AutoManage is a cutting-edge AI management tool designed to streamline your business operations and boost productivity. With its advanced algorithms and intuitive interface, AutoManage simplifies task management, optimizes resource allocation, and provides data-driven insights for informed decision-making.',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    id: 2,
    title: 'Introducing: Productivity Cloud',
    icon: '',
    subtitle:
      'Unlock the power of collaboration with our Productivity Cloud. This innovative platform brings together a suite of tools and features to enhance teamwork, communication, and project management. Say goodbye to scattered workflows and embrace seamless integration for maximized efficiency.',
      avatar: 'https://via.placeholder.com/50',
  },
  {
    id: 3,
    title: 'New Features: Collaborative Docs',
    icon: '',
    subtitle:
      'Get ready to revolutionize your document workflow with our Collaborative Docs feature. This powerful tool allows multiple team members to work on the same document simultaneously, fostering real-time collaboration and improving productivity like never before. Stay ahead of the curve with this game-changing innovation.',
      avatar: 'https://via.placeholder.com/50',
  },
  {
    id: 4,
    title: 'Browsing and VPN services AWS VPCs',
    icon: '',
    subtitle:
      'Secure your online activities with our top-notch VPN and browsing services for AWS VPCs. Our robust infrastructure ensures seamless connectivity, lightning-fast speeds, and unwavering privacy, allowing you to access the internet with confidence and peace of mind.',
      avatar: 'https://via.placeholder.com/50',
  },
  {
    id: 5,
    title: 'Data Recovery Services',
    icon: '',
    subtitle:
      'Dont let data loss derail your operations. Our reliable data recovery services are designed to safeguard your critical information and minimize downtime. With cutting-edge techniques and a team of experts, we can recover your data quickly and efficiently, ensuring business continuity.',
      avatar: 'https://via.placeholder.com/50',
  },
];