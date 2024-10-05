import React, { useEffect, useState, useRef } from 'react';
import './Card.css';

function Card() {
  const token = localStorage.getItem('accessToken');
  const [products, setProducts] = useState([]);
  const nameRef = useRef();
  const priceRef = useRef();
  const descriptionRef = useRef();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch('https://auth-rg69.onrender.com/api/products/private/all', {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data);
      })
      .catch(err => {
        console.log(err);
      });
  }, [token]);

  function handleSubmit(e){
    e.preventDefault();

    const newProduct = {
      name: nameRef.current.value,
      price: parseFloat(priceRef.current.value),
      description: descriptionRef.current.value,
    };

    fetch('https://auth-rg69.onrender.com/api/products/private', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newProduct),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add product');
        }
        return response.json();
      })
      .then(data => {
        setProducts(prevProducts => [...prevProducts, data]); 
        nameRef.current.value = '';
        priceRef.current.value = '';
        descriptionRef.current.value = '';
        setErrorMessage('');
      })
      .catch(error => {
        setErrorMessage('Error adding product: ' + error.message);
      });
  };
  function handleDel(id) {
    fetch(`https://auth-rg69.onrender.com/api/products/private/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete product: ' + response.statusText); 
        }
        return response.json();
      })
      .then(() => {
        
        setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
        alert('Product deleted successfully!');
      })
      .catch(error => {
        console.error('Error deleting product:', error);
        alert('Error deleting product: ' + error.message);
      });
  }
  
  
  
  return (
    <div>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form className='mx-auto mt-20 mb-20 bg-zinc-600' onSubmit={handleSubmit}>
        <input
        className='p-2'
          ref={nameRef}
          type="text"
          placeholder="Product Name"
        />
        <input
         className='p-2'
          ref={priceRef}
          type="number"
          placeholder="Product Price"
        />
        <textarea
         className='p-2'
          ref={descriptionRef}
          placeholder="Product Description"
        />
        <button className='text-yellow-950 *: bg-slate-50' type="submit">Add</button>
      </form>

      <div className="card-container">
        {products.map((product, index) => (
          <div className="card" key={index}>
            <h2>{product.name}</h2>
            <p>Price: ${product.price}</p>
            <p>Description: {product.description}</p>
            <button onClick={handleDel}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Card;
