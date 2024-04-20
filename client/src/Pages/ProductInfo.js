import React, { useState, useEffect } from 'react';
import { FaStar, FaShoppingBag } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import white_converse from '../images/white_converse.jpg';
import nike_air_force_1 from '../images/nike_air_force_1.jpg';
import adidas_gazelle_blue_gold from '../images/adidas_gazelle_blue_gold.jpg';
import doc_martens_jorge from '../images/doc_martens_jorge.jpg';
import hk_crocs_clogs from '../images/hk_crocs_clogs.jpg';
import naruto_crocs_clog from '../images/naruto_crocs_clog.jpg';
import "./ProductInfo.css"

const variableMap = {
    'white_converse': white_converse,
    'nike_air_force_1': nike_air_force_1,
    'adidas_gazelle_blue_gold': adidas_gazelle_blue_gold,
    'doc_martens_jorge': doc_martens_jorge,
    'hk_crocs_clogs': hk_crocs_clogs,
    'naruto_crocs_clog': naruto_crocs_clog
};

export default function ProductInfo() {
    const [quantity, setQuantity] = useState(1);
    const [feedbackData, setFeedbackData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopup2, setShowPopup2] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [error, setError] = useState('');
    const [userType, setUserType] = useState('');
    const userEmail = localStorage.getItem("userEmail");
    const product = JSON.parse(localStorage.getItem('ProductInfo'));
    const [actionType, setActionType] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [changesSaved, setChangesSaved] = useState(false); // Define setChangesSaved state

    useEffect(() => {
        setUserType(localStorage.getItem('userType'));
    }, []);

    const handleAddCart = async () => {
        try {
            const response = await fetch('https://cosc-3380-6au9.vercel.app/api/handlers/products/addToCart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...product, quantity, email: userEmail })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to add product');
            }
            setShowPopup(true);
            setPopupMessage('Item added to cart!');
        } catch (error) {
            console.error('Error adding to Cart:', error);
            setError(error.message);
        }
    };

    const handleUpdatePrice = async () => {
        try {
            const response = await fetch('https://cosc-3380-6au9.vercel.app/api/handlers/products/updateProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ product_id: product.product_id, price: product.price })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update product');
            }
            setShowPopup2(true);
        } catch (error) {
            console.error('Error adjusting price:', error);
            setError(error.message);
        }
    };

    const handleAdjustPrice = () => {
        const newPriceInput = window.prompt('Enter the new price:');
        if (newPriceInput) {
            const newPriceValue = parseFloat(newPriceInput);
            if (!isNaN(newPriceValue)) {
                setNewPrice(newPriceValue);
                product.price = newPriceValue;
                localStorage.setItem('ProductInfo', JSON.stringify(product));
                handleUpdatePrice();
                setShowPopup2(true);
                setPopupMessage('Price adjusted successfully!');
                setChangesSaved(true);
            } else {
                setError('Invalid price. Please enter a valid number.');
            }
        }
    };

    const handleOrderShoe = () => {
        const orderQuantity = window.prompt('Enter the quantity to order:');
        if (orderQuantity) {
            const orderQuantityValue = parseInt(orderQuantity);
            if (!isNaN(orderQuantityValue) && orderQuantityValue > 0) {
                // Handle ordering logic here
                setShowPopup(true);
                setPopupMessage('Order placed successfully!');
                setChangesSaved(true);
            } else {
                setError('Invalid quantity. Please enter a valid number.');
            }
        }
    };

    const handleCompleteAction = () => {
        setShowPopup(false);
        setShowPopup2(false);
        setError('');
        setNewPrice('');
        setChangesSaved(false); // Reset changesSaved state
    };
    
    if (userType === 'Customer') {
        return (
            <div className="product-info-container">
                <img className="product-img" src={variableMap[product.image_filename]} alt={product.item_name} />
                <div className="card-details">
                    <h3 className="card-title">{product.item_name}</h3>
                    <div className="card-description">{product.description}</div>
                    <div className="card-reviews">
                        <FaStar />
                        <span className="total-reviews">4 Reviews</span>
                    </div>
                    <div className="bag">
                        <FaShoppingBag />
                        <div className="price">${product.price}</div>
                    </div>
                    <div className="add-container">
                        <button className="quantity-button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                        <input type="text" className="quantity-input" value={quantity} readOnly />
                        <button className="quantity-button" onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                    <button id="add-button" onClick={handleAddCart}>Add to Cart</button>
                    {feedbackData.length > 0 && (
                        <div className="feedback-container">
                            <h3>Feedback</h3>
                            <ul>
                                {feedbackData.map((feedback, index) => (
                                    <li key={index}>{feedback.comment}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {showPopup && (
                        <div className="popup">
                            <p>Item added to cart!</p>
                            <Link to="/cart" className="go-to-cart">Go to Cart</Link>
                            <button onClick={() => setShowPopup(false)}>Close</button>
                        </div>
                    )}
                    {error && (
                        <div className="error-message">
                            <p>Error: {error}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <div className="product-info-container">
                    <img className="product-img" src={variableMap[product.image_filename]} alt={product.item_name} />
                    <div className="card-details">
                        <h3 className="card-title">{product.item_name}</h3>
                        <div className="card-description">{product.description}</div>
                        <div className="card-reviews">
                            <FaStar />
                            <span className="total-reviews">4 Reviews</span>
                        </div>
                        <div className="bag">
                            <FaShoppingBag />
                            <div className="price">${product.price}</div>
                        </div>
                        <div className="manager-actions">
                            <button id="adjust-price" onClick={() => handleAdjustPrice(product)}>Adjust Price</button>
                            <button id="order-shoe" onClick={() => handleOrderShoe(product)}>Order Shoe</button>
                        </div>
                        {feedbackData.length > 0 && (
                            <div className="feedback-container">
                                <h3>Feedback</h3>
                                <ul>
                                    {feedbackData.map((feedback, index) => (
                                        <li key={index}>{feedback.comment}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {showPopup2 && (
                            <div className="popup">
                                <p>Price has been adjusted!</p>
                                <button onClick={() => setShowPopup2(false)}>Close</button>
                            </div>
                        )}
                        {error && (
                            <div className="error-message">
                                <p>Error: {error}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="product-review-container">
                    <center><h2>Reviews</h2></center>
                    <div className="user-review-box">
                        <p id="customer-name-box">John Doe: </p>
                        <p id="customer-review-box">This is where the review will be what if its loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong</p>
                    </div>
                    {/* {Each review will need to be in a className='user-review-box' div} */}
                </div>
            </div>
        );
    }
};
