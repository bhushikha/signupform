async function saveToMySQL(event) {
    event.preventDefault();

    var price = document.getElementById('price').value;
    var name = document.getElementById('name').value;
    var category = document.getElementById('category').value;

    var requestBody = {
        price: price,
        name: name,
        category: category
    };

    try {
        const response = await axios.post('/expence/addexpense', requestBody);
        if (response.status === 200) {
            await fetchProducts();
        } else {
            throw new Error('Failed to add product');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function fetchProducts() {
    axios.get('/expence/products')
        .then(function (response) {
            if (response.status === 200) {
                var productListElement = document.getElementById('listOfProducts');
                productListElement.innerHTML = '';

                var data = response.data;
                data.forEach(function (product) {
                    var listItem = document.createElement('li');
                    listItem.textContent = `${product.name} - $${product.price}`;
                    var deleteButton = createDeleteButton(product.id); // Assuming the product has an 'id' field
                    listItem.appendChild(deleteButton);
                    productListElement.appendChild(listItem);
                });
            } else {
                throw new Error('Failed to fetch products');
            }
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}

function createDeleteButton(productId) {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function () {
        deleteProduct(productId);
    };
    return deleteButton;
}

function deleteProduct(productId) {
    const token = localStorage.getItem('token');

    axios.delete(`/expence/products/${productId}`, {
        headers: {
            Authorization: token,
        },
    })
        .then((response) => {
            fetchProducts();
        })
        .catch((error) => {
            console.error('Error deleting product:', error);
        });
}
document.getElementById('rzp-button').onclick = function (e) {
    buyPremiumMembership();
};

async function buyPremiumMembership() {
    console.log('Initiating Razorpay payment...');

    try {
        // Create an order on the server and get the order ID
        const response = await axios.post('/expence/createOrder');
        console.log('Create Order API response:', response);

        if (response.status === 200) {
            const orderId = response.data.orderId;
            console.log('Order ID:', orderId);

            // Get Razorpay options from the server
            const razorpayOptionsResponse = await axios.get(`/expence/razorpay/${orderId}`);
            const options = razorpayOptionsResponse.data;

            // Open Razorpay payment page
            var rzp = new Razorpay(options);
            rzp.open();
        } else {
            throw new Error('Failed to create order');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Fetch products on page load
window.addEventListener('DOMContentLoaded', function () {
    fetchProducts();
});
