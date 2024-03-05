import React from 'react'
//import Navbar from '../navbar/index'
const LandingPage = () => {
  return (
    <>
<main class="h-full flex items-center px-6 lg:px-32 bg-grey-900 text-white">
<header class="w-full absolute left-0 top-0 p-6 lg:p-32">
    <div class="flex justify-between">
      <div>
        <h1 class="text-3xl font-bold">HOYAA</h1>
        <span>Design is everything...</span>
      </div>
    </div>
  </header>
<section class="w-full md:w-9/12 xl:w-8/12">
<h1 class="text-3xl lg:text-5xl font-bold text-pink-500">
      Cyber Cafe<br/>Online
    </h1>
<p class="font-bold mb-1">The Design is in the details ...</p>
<p>Lorem ipsum dolor sit amet...</p>
</section>    
<footer class="absolute right-0 bottom-0 p-6 lg:p-32">
    <p class="font-bold mb-1">Yours Truly</p>
    <p>Chigozie Orunta (Full Stack Engineer)</p>
</footer>
</main>
    </>
  )
}

export default LandingPage;