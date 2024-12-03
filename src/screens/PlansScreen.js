import React, { useEffect, useState } from 'react';
import './PlansScreen.css';
import db from '../firebase'; // Ensure the import path is correct
import { useSelector } from 'react-redux';
import { selectUser } from '../features/counter/userSlice';
import { loadStripe } from '@stripe/stripe-js';
import { collection, getDocs, addDoc, onSnapshot, query, where } from 'firebase/firestore';

function PlansScreen() {
  const [products, setProducts] = useState({});
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);

  // Fetch user subscription details
  useEffect(() => {
    if (user?.uid) {
      const subscriptionRef = collection(db, 'customers', user.uid, 'subscriptions');
      getDocs(subscriptionRef).then((querySnapshot) => {
        querySnapshot.forEach((subscriptionDoc) => {
          const subscriptionData = subscriptionDoc.data();
          console.log('Fetched Subscription Data:', subscriptionData); // Log the fetched data
          setSubscription({
            role: subscriptionData.role,
            current_period_end: subscriptionData.current_period_end.seconds,
            current_period_start: subscriptionData.current_period_start.seconds,
          });
        });
      });
    }
  }, [user?.uid]);

  // Fetch available products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      if (user?.uid) {
        const productsRef = query(collection(db, 'products'), where('active', '==', true));
        const querySnapshot = await getDocs(productsRef);
        const products = {};

        for (const productDoc of querySnapshot.docs) {
          const productData = productDoc.data();
          console.log('Fetched Product Data:', productData); // Log the fetched product data
          const priceSnap = await getDocs(collection(productDoc.ref, 'prices'));
          const prices = priceSnap.docs.map(price => ({
            priceId: price.id,
            priceData: price.data(),
          }));

          products[productDoc.id] = {
            ...productData,
            prices, // Store prices in the product object
          };
        }
        setProducts(products);
      }
    };

    fetchProducts();
  }, [user?.uid]);

  // Handle checkout process
  const loadCheckout = async (priceId) => {
    const checkoutSessionRef = await addDoc(
      collection(db, 'customers', user.uid, 'checkout_sessions'),
      {
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      }
    );

    onSnapshot(checkoutSessionRef, async (snap) => {
      const { error, sessionId } = snap.data();

      if (error) {
        alert(`An error occurred: ${error.message}`);
      }

      if (sessionId) {
        const stripe = await loadStripe('pk_test_51QD6DbBQKsLQwVRQM7rgvoqvVttlsDaoby5iFTmaWSfYigqwC8vvjBFNHsjbnfwADDlCfUDXQztcmxvxeRd6ObaU00Bn1RFfEq');
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  useEffect(() => {
    console.log('Subscription State Updated:', subscription);
  }, [subscription]);

  return (
    <div className="plansScreen">
      <br />
      {subscription && (
        <p>Renewal date: {new Date(subscription.current_period_end * 1000).toLocaleDateString()}</p>
      )}
      {Object.entries(products).map(([productId, productData]) => {
        const isCurrentPackage = productData.name?.toLowerCase().includes(subscription?.role?.toLowerCase());

        // Debugging: Log the product name and subscription role
        console.log('Product Name:', productData.name);
        console.log('Subscription Role:', subscription?.role);
        console.log('Is Current Package:', isCurrentPackage);

        return (
          <div
            key={productId}
            className={`${
              isCurrentPackage && 'plansScreen__plan--disabled'
            } plansScreen__plan`}
          >
            <div className="plansScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button
              onClick={() => !isCurrentPackage && loadCheckout(productData.prices[0]?.priceId)} // Use the first priceId
              disabled={isCurrentPackage}
            >
              {isCurrentPackage ? 'Current Package' : 'Subscribe'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlansScreen;
