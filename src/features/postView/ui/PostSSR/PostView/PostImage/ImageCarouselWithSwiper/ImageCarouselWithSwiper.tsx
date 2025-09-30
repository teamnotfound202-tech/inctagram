// Import necessary Swiper components, modules and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {ImagePost} from "@/features/postView/api/types";

type Props = {
    imagesArray: ImagePost[]
}

// Define your component
export default function ImageCarousel({imagesArray}:Props) {
    // Example array of image URLs
   /* const images = [
        '/path/to/your/image1.jpg',
        '/path/to/your/image2.jpg',
        '/path/to/your/image3.jpg',
    ];*/
    const images = imagesArray.map(imagePost=>imagePost.url)

    return (
        <Swiper
            // Install modules
            modules={[Navigation, Pagination, A11y]}
            // Basic parameters
            spaceBetween={50}
            slidesPerView={1}
            loop={true}
            // Navigation configuration
            navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }}
            // Pagination configuration
            pagination={{
                clickable: true,
            }}
            // Optional: accessibility
            a11y={{
                prevSlideMessage: 'Previous slide',
                nextSlideMessage: 'Next slide',
                paginationBulletMessage: 'Go to slide {{index}}',
            }}
        >
            {/* Render slides using the image array */}
            {images.map((imageUrl, index) => (
                <SwiperSlide key={index}>
                    {/* Use Next.js Image component for optimized loading */}
                    <img
                        src={imageUrl}
                        alt={`Slide ${index + 1}`}
                        style={{ width: '100%', height: 'auto' }}
                    />
                </SwiperSlide>
            ))}

            {/* Add navigation buttons (you can style these as needed) */}
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>

            {/* Add pagination dots */}
            <div className="swiper-pagination"></div>
        </Swiper>
    );
}