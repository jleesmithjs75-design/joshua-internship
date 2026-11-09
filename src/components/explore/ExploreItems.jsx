import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "../UI/Skeleton";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";


  const ExploreItems = () => {
    const [itemCount, setItemCount] = useState(8);
    const [exploreItems, setExploreItems] = useState([]);
    const [skeletonLoading, setSkeletonLoading] = useState(true);
    
  const getExploreData = async () => {
    setSkeletonLoading(true);
    try {
    const response = await axios.get(
      `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore`
    );
    setExploreItems([...response.data, ...response.data]);
  } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setSkeletonLoading(false);
    }
  };


  async function filterItems(filter) {
    try{
    setSkeletonLoading(true);
    const response = await axios.get(
      `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore?filter=${filter}`
    );

    setExploreItems([...response.data, ...response.data]);
    setSkeletonLoading(false);
   } catch (error) {
      console.error("Error filtering data:", error);
    } finally {
      setSkeletonLoading(false);
    }
  }

  useEffect(() => {
    AOS.init({
      once: false,
      mirror: true,
      duration: 800,
    });
    getExploreData();
  }, []);
if (exploreItems.length > 0) {
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }
  
  return (
    <>
      <div>
        <select
          id="filter-items"
          defaultValue=""
          onChange={(event) => filterItems(event.target.value)}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>

       <div className="row" style={{ width: "100%", display: "flex", flexWrap: "wrap" }}></div>
        {exploreItems.length > 0 && !skeletonLoading ? (
        exploreItems.slice(0, itemCount).map((item, index) => (
          <div
            key={index}
            className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
            style={{ display: "block", backgroundSize: "cover" }}
             data-aos="fade-up"
          >
            <div className="nft__item">
              <div className="author_list_pp">
                <Link
                  to={`/author/${item.authorId}`}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title={item.authorName}
                  >
                   <img className="lazy" src={item.authorImage} alt="" />
                  <i className="fa fa-check"></i>
                </Link>
              </div>
       

              <div className="nft__item_wrap">
                <Link to={`/item-details/${item.nftId}`}>
                  <img
                    src={item.nftImage}
                    className="lazy nft__item_preview"
                    alt=""
                  />
                </Link>
              </div>
              <div className="nft__item_info">
                <Link to={`/item-details/${item.nftId}`}>
                  <h4>{item.title}</h4>
                </Link>
                <div className="nft__item_price">
                  {item.price} ETH<span>{item.date}</span>
                </div>
                <div className="nft__item_like">
                  <i className="fa fa-heart"></i>
                  <span>{item.likes}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <>
          {new Array(8).fill(0).map((_, index) => (
            <div key={index} className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
              <Skeleton width="100%" height="400px" />
            </div>
          ))}
        </>
      )}

      
      {exploreItems.length > 0 && itemCount < exploreItems.length && (
                <div className="col-md-12 text-center" style={{ display: "block", marginTop: "30px", marginBottom: "30px", width: "100%" }}>
          <button
          onClick={() => setItemCount((prev) => Math.min(prev + 4, 16))}
          id="loadmore"
          className="btn-main lead"
          data-aos="zoom-in" 
          style={{
            background: "#8364e2",
            color: "#ffffff",
            padding: "10px 30px",
            borderRadius: "6px",
            border: "none",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            display: itemCount >= 16 ? "none" : "inline-block"
          }}
        >
          Load more
        </button>
        </div>
      )}


      {/*<div className="col-md-12 text-center">
        {itemCount !== 16 && (
          <Link
            onClick={() => setItemCount(itemCount + 4)}
            to="#"
            id="loadmore"
            className="btn-main lead"
            data-aos="fade-up"     
          >      
            Load more
          </Link>
        )} 
      </div> */}
    </>
  );
};

export default ExploreItems;
