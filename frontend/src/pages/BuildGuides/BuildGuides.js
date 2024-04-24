import React from 'react';
import './BuildGuides.css'; // Assuming you have some CSS in BuildGuides.css

function BuildGuides() {
    return (
        <div className="buildguides">

            <div className="header">
                <div className="left-section">
                    {/* Add your image or content for the left section */}
                    {/* <img src="left-image.jpg" alt="Left Image" /> */}
                </div>
                <div className="middle-section">
                    <h1>Welcome to Build Guides</h1>
                    <p>Learn What Each Part Does!</p>
                </div>
                <div className="right-section">
                    {/* Add your image or content for the right section */}
                    {/* <img src="right-image.jpg" alt="Right Image" /> */}
                </div>
            </div>

            {/* <div className="card">
                <h1>New Gamers</h1>
                <p>Are you just starting your journey into the exciting world of PC gaming? Welcome aboard! For new players, we recommend starting with a build that strikes a balance between performance and affordability. Consider opting for a lower-tier CPU that gets the job done without breaking the bank. Investing in a mid-range graphics card will ensure smooth gameplay for popular titles while keeping costs in check. With our carefully curated recommendations, you can build a solid gaming rig that will serve you well as you dive into the world of PC gaming.</p>
            </div>
            <div className="card">
                <h1>Casual Gamers</h1>
                <p>Are you a nightly gamer who enjoys unwinding with your favorite titles after a long day? We've got the perfect builds to enhance your gaming experience without breaking the budget. For casual gamers, we recommend focusing on mid-range components that deliver excellent performance without unnecessary extravagance. Consider investing in a reliable CPU and GPU combination that can handle a variety of games with ease. With our recommendations, you can build a gaming PC that provides hours of entertainment without compromise.</p>
            </div>
            <div className="card">
                <h1>Competitive Gamers</h1>
                <p>Do you thrive on the thrill of competition and strive for victory in every match? When it comes to competitive gaming, every millisecond counts. For competitive gamers, we recommend investing in high-performance components that give you the edge you need to dominate the battlefield. Opt for a top-tier CPU and GPU combination that delivers maximum frame rates and minimum input lag. With our expert recommendations, you can build a gaming rig that's optimized for victory, allowing you to rise through the ranks and achieve your full gaming potential.</p>
            </div>
            <div className="card">
                <h1>The Streamer</h1>
                <p>Are you ready to share your gaming adventures with the world? In the Streamer section, we've got the perfect builds for content creators like you. Invest in a powerful CPU for smooth streaming and multitasking, paired with a graphics card that balances performance and encoding capabilities. With our expert recommendations, you can create a streaming setup that showcases your gaming skills and personality, entertaining and engaging your audience with ease.</p>
            </div> */}


            <div className="types-row">
            <div className="type">
                    
                    <img className="controller" src="https://image.shutterstock.com/image-photo/stock-vector-minimal-gaming-symbol-stream-modern-games-wireless-controller-icon-vector-250nw-1726514476.jpg"/>
                    <h2>New Gamers</h2>
                    <p>Are you just starting your journey into the exciting world of PC gaming? 
                        Welcome aboard! For new players, we recommend starting with a build that 
                        strikes a balance between performance and affordability. Consider opting for 
                        a lower-tier CPU that gets the job done without breaking the bank. Investing in 
                        a mid-range graphics card will ensure smooth gameplay for popular titles while 
                        keeping costs in check. With our carefully curated recommendations, you can 
                        build a solid gaming rig that will serve you well as you dive into the world of PC gaming.</p>
                </div>
                <div className="type">

                    <img className="headset" src="https://t3.ftcdn.net/jpg/04/12/64/42/360_F_412644208_F7LB2yYrsRnYz77cJwr1Rc4DUuffsCfx.jpg"/>
                    <h2>Casual Gamers</h2>
                    <p>Are you a nightly gamer who enjoys unwinding with your favorite titles after a long day?
                         We've got the perfect builds to enhance your gaming experience without breaking the budget.
                          For casual gamers, we recommend focusing on mid-range components that deliver excellent performance
                           without unnecessary extravagance. Consider investing in a reliable CPU and GPU combination that can
                            handle a variety of games with ease. With our recommendations, you can build a gaming PC that
                             provides hours of entertainment without compromise.</p>
                </div>
                <div className="type">

                    <img className="sword" src="https://static.vecteezy.com/system/resources/previews/002/628/343/non_2x/crossed-swords-icon-illustration-free-vector.jpg"/>
                    <h2>Competitive Gamers</h2>
                    <p>Do you thrive on the thrill of competition and strive for victory in every match? When it comes to
                         competitive gaming, every millisecond counts. For competitive gamers, we recommend investing in
                          high-performance components that give you the edge you need to dominate the battlefield. Opt
                           for a top-tier CPU and GPU combination that delivers maximum frame rates and minimum input
                            lag. With our expert recommendations, you can build a gaming rig that's optimized for victory,
                             allowing you to rise through the ranks and achieve your full gaming potential.</p>
                </div>
                <div className ="type">

                    <img className="streamer" src="https://cdn-icons-png.flaticon.com/512/2201/2201318.png"/>
                    <h2>The Streamer</h2>
                    <p>Are you an aspiring streamer? A reliable PC is essential for high-quality streams while maintaining smooth
                         gameplay. Invest in a powerful CPU for streaming software and multitasking, paired with a graphics card
                          for performance and encoding. Our expert recommendations help you build a setup that showcases your skills
                           and personality, engaging your audience effortlessly.</p>
                </div>
                {/* Add more types as needed */} 
            </div>

            <div className="card-container">
            <div className="card">
                <h1>CPU (Central Processing Unit)</h1>
                <p>Function: The CPU acts as the brain of your computer, handling calculations and executing tasks.</p>
                <p>Importance: A powerful CPU is crucial for gaming, as it affects overall system performance and determines how well your PC can handle complex game physics and AI calculations.</p>
            </div>
            <div className="card">
                <h1>Motherboard</h1>
                <p>Function: The motherboard is the main circuit board that connects all components together and allows them to communicate with each other.</p>
                <p>Importance: Choosing a compatible motherboard is crucial for ensuring that all your components work together seamlessly.</p>
            </div>
            <div className="card">
                <h1>Memory (RAM)</h1>
                <p>Function: RAM stores data temporarily for quick access by the CPU, allowing for faster multitasking and smoother performance.</p>
                <p>Importance: Sufficient RAM ensures that your games and applications run smoothly without slowdowns or stuttering.</p>
            </div>
            <div className="card">
                <h1>Storage</h1>
                <p>Function: Storage devices store your operating system, games, and files.</p>
                <p>Importance: An SSD (Solid State Drive) provides faster load times and system responsiveness compared to an HDD (Hard Disk Drive), enhancing your gaming experience with shorter loading screens and quicker boot times.</p>
            </div>
            <div className="card">
                <h1>Graphics Card (GPU)</h1>
                <p>Function: The GPU renders images and graphics, producing the visuals you see on your monitor.</p>
                <p>Importance: For gaming, a high-performance GPU is essential for achieving smooth frame rates and stunning visuals in modern games.</p>
            </div>
            <div className="card">
                <h1>Case</h1>
                <p>Function: The case houses all your components and provides airflow to keep them cool.</p>
                <p>Importance: Choosing a case with adequate airflow and cable management options helps maintain optimal temperatures and prolongs the lifespan of your components.</p>
            </div>
            <div className="card">
                <h1>Power Supply (PSU)</h1>
                <p>Function: The PSU supplies power to all components in your PC.</p>
                <p>Importance: A reliable and efficient PSU is essential for stable operation and protecting your components from power-related issues.</p>
            </div>
            
        </div>
        </div>
    );
}

export default BuildGuides;
