import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom'; // Assuming you have some CSS in Home.css

function Home() {
    return (
        <div className="home">
            <div className="left-column">
                <div className="button-container">
                    {/* <button className="small-button" onClick={() => {BuildGuides.js}}>Build Guides</button> */}

                     {/* Use Link to navigate to the BuildGuides page */}
                     <Link to="/buildguides" className="small-button">Build Guides</Link>
                    
                    <img className="cpu-image" src="https://t3.ftcdn.net/jpg/00/81/24/72/360_F_81247213_OYvGTCn5mnQQ2c0gWJ1U5ixcbmNBaMOp.jpg" alt="CPU Image"/>
                    <img className="motherboard-image" src="https://www.totalphase.com/media/blog/2022/06/pexels-andrey-matveev-5766819-1024x683.jpg" alt="Motherboard Image"/>
                    <img className="RAM-image" src="https://www.pcbuildadvisor.com/wp-content/uploads/2015/09/RAM-for-a-PC.jpg" alt="RAM Image"/>
                    <img className="Storage-image" src="https://www.seagate.com/content/dam/seagate/migrated-assets/www-content/product-content/pc-gaming-drives/_shared/images/pc-gaming-solutions-fc-520.png" alt="Storage Image"/>
                    <img className="CPU-image" src="https://www.hellotech.com/blog/wp-content/uploads/2020/02/what-is-a-gpu.jpg" alt="CPU Image"/>
                    <img className="Case-image" src="https://assets.corsair.com/image/upload/c_scale%2Cq_auto/products/Cases/base-5000d-airflow/Gallery/5000D_AF_BLACK_001.webp" alt="Case Image"/>
                    <img className="PSU-image" src="https://www.lifewire.com/thmb/Gb9Gx1CUa04i_-cq35BvBTEPdL0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/power-supply-5aba984fba617700376b877f.PNG" alt="PSU Image"/>


                </div>
            </div>
            <div className="middle-column">
                <h1>Welcome to Dreamworks</h1>
                <p>Start building your dream PC today!</p>
                <p>"Dreamworks" aims to demystify the process of building a custom PC, making it
                accessible to both novices and experienced builders. By combining a comprehensive
                selection of components with detailed information and guidance, the application
                empowers users to create their ideal computer setup, tailored to their unique requirements
                and preferences.</p>
                <p>_____________________________________________________________</p>
                <h2>Take Advantage Of:</h2>
                <p>The Intuitive Build Wizard: a user-friendly interface that takes users through a series 
                    of steps to select components for their custom PC build. Each step focuses on a different component,
                    ensuring compatibility and informed decisions.</p>
                <p>_____________________________________________________________</p>
                <p>Customization and Options: a wide range of options for each component, catering 
                    to different budgets, performance requirements, and personal preferences.</p>
                <p>_____________________________________________________________</p>
                <p>Saving and Sharing Builds: users can save their custom builds for future reference or
                     share them with friends, social media, or the Building Dreams community for feedback or suggestions</p>
                <p>_____________________________________________________________</p>
                <p>Educational Resources: tips, recommendations, and educational resources are provided to help users make
                     informed decisions about their builds. This includes explanations of component specifications and how
                      they affect performance</p>
                <p>_____________________________________________________________</p>
                <p>Responsive Design: the application is designed to be responsive and accessible on various devices,
                     including desktops, tablets, and smartphones, ensuring a wide audience can use the service.</p>
                <p>_____________________________________________________________</p>
                <p>User Accounts and Management: users can create accounts to manage their builds,
                     save multiple configurations, and access them anytime</p>
                <p>_____________________________________________________________</p>
                <p>Chat System: allows users to communicate with administrators and friends to talk about their builds</p>

            </div>
            <div className="right-column">
                <img className="small-image" src="https://www.cyberpowerpc.com/images/cs/prism321v/cs-450-179_400.png" alt="small image" />
                <img className="small-image" src="https://static.cybertron.com/clx/components/cas-lia-pco11do/gallery/1.png" alt="small image2"/>
                <img className="small-image" src="https://c1.neweggimages.com/NeweggImage/productimage/83-289-215-V01.jpg" alt="small image3"/>
                <img className="small-image" src="https://m.media-amazon.com/images/I/91LSF1iZUFL.jpg" alt="small image4"/>

            </div>
        </div>
    );
}

export default Home;
