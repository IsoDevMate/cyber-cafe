import React from 'react';
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";

export const Services = () => {
  const blogData = [
    {
      imgSrc: 'https://cdn.tailgrids.com/1.0/assets/images/blogs/blog-01/image-01.jpg',
      date: 'Dec 22, 2023',
      title: 'Meet AutoManage, the best AI management tools',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    },
    {
      imgSrc: 'https://cdn.tailgrids.com/1.0/assets/images/blogs/blog-02/image-01.jpg',
      date: 'Nov 15, 2023',
      title: 'Introducing: Productivity Cloud',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    },
    {
      imgSrc: 'https://cdn.tailgrids.com/1.0/assets/images/blogs/blog-03/image-01.jpg',
      date: 'Oct 10, 2023',
      title: 'New Features: Collaborative Docs',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    },
    {
        imgSrc: 'https://cdn.tailgrids.com/1.0/assets/images/blogs/blog-04/image-01.jpg',
        date: 'Sep 20, 2023',
        title: 'Advanced Analytics for Businesses',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      },
  ];

  return (
    <section className="pt-20 lg:pt-[120px] pb-10 lg:pb-20 bg-gray-00">
      <div className="container">
        <div className="flex flex-wrap justify-center -mx-4">
          <div className="w-full px-4">
            <div className="text-center mx-auto mb-[60px] lg:mb-20 max-w-[510px]">
              <span className="font-bold text-lg text-primary mb-2 block">
                Our Blogs
              </span>
              <h2 className="font-semibold text-3xl sm:text-4xl md:text-[40px] text-dark mb-4">
                Our Recent News
              </h2>
              <p className="text-base text-body-color">
                There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap -mx-4 w-14">
  {blogData.map((blog, index) => (
   <div key={index} className="w-40 flex flex-wrap md:w-1/2 lg:w-1/4 px-4 mb-10">
      <Card className="max-w-[370px] mx-auto mb-8">
        <div className="relative top-0 md:max-w-2xl lg:mx-auto">
          <img
            src={blog.imgSrc}
            alt="blog"
            className="block t-img object-cover h-1/4 rounded-md aspect-square w-[250px] lg:w-[190px] lg:h-[190px]"
          />
        </div>
        <CardBody>
          <Typography variant="small" color="blue-gray" className="mb-2">
            {blog.date}
          </Typography>
          <Typography variant="h5" color="blue-gray" className="mb-2">
            {blog.title}
          </Typography>
          <Typography color="gray" className="font-normal">
            {blog.description}
          </Typography>
        </CardBody>
      </Card>
      {index === 0 && <div className="w-full mb-8 border-b border-gray-200"></div>}
    </div>
  ))}
</div>
      </div>
    </section>
  );
};