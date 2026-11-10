const cartItems = [];
    const cartList = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const orderButton = document.getElementById("order-now-btn");
    const clearCartButton = document.getElementById("clear-cart");
    const notification = document.getElementById("notification");
    const discountInfo = document.getElementById("discount-info");
    
    // Modal elements
    const confirmationModal = document.getElementById("confirmation-modal");
    const orderItemsContainer = document.getElementById("order-items");
    const modalTotal = document.getElementById("modal-total");
    const cancelOrderBtn = document.getElementById("cancel-order");
    const confirmOrderBtn = document.getElementById("confirm-order");
    const discountModal = document.getElementById("discount-modal");
    const discountYesBtn = document.getElementById("discount-yes");
    const discountNoBtn = document.getElementById("discount-no");

    let quizDiscount = null;
    let quizScore = null;

    // Check if returning from quiz with discount or quiz tried
    window.addEventListener('load', function() {
        const quizDiscountVal = sessionStorage.getItem('quizDiscount');
        const quizScoreVal = sessionStorage.getItem('quizScore');
        const quizTried = sessionStorage.getItem('quizTried');
        
        if (quizDiscountVal && quizScoreVal) {
            quizDiscount = parseFloat(quizDiscountVal);
            quizScore = parseInt(quizScoreVal);
            showDiscountInfo(quizScore, quizDiscount);
            sessionStorage.removeItem('quizDiscount');
            sessionStorage.removeItem('quizScore');
            sessionStorage.removeItem('quizTried');
        } else if (quizTried) {
            // User tried quiz but did not get discount: purchase directly
            showNoDiscountPurchase();
            sessionStorage.removeItem('quizTried');
        }
        // Restore cart if available
        const savedCart = localStorage.getItem('savedCart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            cartItems.length = 0;
            cartItems.push(...parsedCart);
            updateCart();
            localStorage.removeItem('savedCart');
        }
    });

    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const name = button.getAttribute("data-name");
            const price = parseFloat(button.getAttribute("data-price"));
            let quantity = 1;
            let cartItem = cartItems.find(item => item.name === name && item.price === price);
            // Limit: user can choose up to 10 of each item
            if (cartItem) {
                if (cartItem.quantity >= 10) {
                    showNotification(`You can only add up to 10 of ${name}.`);
                    return;
                }
                cartItem.quantity += quantity;
            } else {
                cartItems.push({ name, price, quantity });
            }
            updateCart();
            showNotification(`${quantity} ${name}${quantity > 1 ? 's' : ''} added to cart!`);
        });
    });

    // Clear cart button functionality
    clearCartButton.addEventListener("click", () => {
        if (cartItems.length > 0) {
            cartItems.length = 0;
            updateCart();
            discountInfo.style.display = 'none';
            showNotification("Cart cleared");
        }
    });

    // Order button functionality - advanced discount prompt
    orderButton.addEventListener("click", () => {
        if (cartItems.length === 0) {
            showNotification("Your cart is empty. Add some items before ordering.");
            return;
        }
        if (quizDiscount) {
            // Handle purchase with discount
            let total = cartItems.reduce((sum, item) => sum + item.price, 0);
            let discountAmount = total * (quizDiscount / 100);
            let displayTotal = total - discountAmount;
            showNotification(`Thank you for your purchase! Total: $${displayTotal.toFixed(2)}`);
            cartItems.length = 0;
            quizDiscount = null;
            quizScore = null;
            updateCart();
            // After notification, revert button text
            setTimeout(() => {
                orderButton.textContent = "Order now";
            }, 3000);
            discountInfo.style.display = 'none';
        } else {
            // Show custom modal instead of confirm()
            discountModal.classList.add("active");
        }
    });

    // Discount modal button handlers
    discountYesBtn.addEventListener("click", () => {
        discountModal.classList.remove("active");
        // Save cart to localStorage
        localStorage.setItem('savedCart', JSON.stringify(cartItems));
        // Mark that user tried the quiz (in case they don't win)
        sessionStorage.setItem('quizTried', '1');
        // Redirect to quiz page
        window.location.href = "discountgame.html";
    });

    discountNoBtn.addEventListener("click", () => {
        discountModal.classList.remove("active");
        // Proceed to purchase without discount
        let total = cartItems.reduce((sum, item) => sum + item.price, 0);
        showNotification(`Thank you for your purchase! Total: $${total.toFixed(2)}`);
        cartItems.length = 0;
        updateCart();
    });

    // If user returns from quiz and did not get discount, auto-purchase
    function showNoDiscountPurchase() {
        if (cartItems.length === 0) return;
        let total = cartItems.reduce((sum, item) => sum + item.price, 0);
        showNotification(`Thank you for your purchase! Total: $${total.toFixed(2)}`);
        cartItems.length = 0;
        updateCart();
        // Scroll to cart box after auto-purchase
        document.querySelector('.cart').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Cancel order button
    cancelOrderBtn.addEventListener("click", () => {
        confirmationModal.classList.remove("active");
    });
    
    // Confirm order button
    confirmOrderBtn.addEventListener("click", confirmOrder);

    function updateCart() {
        cartList.innerHTML = "";
        let total = 0;

        if (cartItems.length === 0) {
            cartList.innerHTML = '<li class="empty-cart">Your cart is empty</li>';
            orderButton.disabled = true;
        } else {
            orderButton.disabled = false;
            cartItems.forEach((item, index) => {
                let qty = (typeof item.quantity === 'number' && item.quantity > 0) ? item.quantity : 1;
                item.quantity = qty;
                const li = document.createElement("li");
                li.className = "cart-item";
                li.innerHTML = `
                    <div class="item-info">
                        ${item.name}
                        <button class="cart-qty-btn" data-action="decrement" data-index="${index}">-</button>
                        <span class="cart-qty-value">${qty}</span>
                        <button class="cart-qty-btn" data-action="increment" data-index="${index}">+</button>
                        - $${(item.price * qty).toFixed(2)}
                    </div>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                `;
                cartList.appendChild(li);
                total += item.price * qty;
                // Quantity buttons
                li.querySelector('.cart-qty-btn[data-action="decrement"]').addEventListener('click', function() {
                    if (item.quantity > 1) {
                        item.quantity--;
                        updateCart();
                        showNotification(`${item.name} quantity: ${item.quantity}`);
                    }
                });
                li.querySelector('.cart-qty-btn[data-action="increment"]').addEventListener('click', function() {
                    if (item.quantity < 10) {
                        item.quantity++;
                        updateCart();
                        showNotification(`${item.name} quantity: ${item.quantity}`);
                    } else {
                        showNotification(`You can only add up to 10 of ${item.name}.`);
                    }
                });
                // Remove button
                li.querySelector('.remove-btn').addEventListener('click', function() {
                    removeFromCart(index);
                });
            });
        }

        // Apply discount if available
        let displayTotal = total;
        if (quizDiscount) {
            const discountAmount = total * (quizDiscount / 100);
            displayTotal = total - discountAmount;
            discountInfo.innerHTML = `
                <p>🎉 You scored ${quizScore}/5 on the quiz!</p>
                <p>You've earned a ${quizDiscount}% discount!</p>
                <p>Original total: $${total.toFixed(2)}</p>
                <p>Discount: -$${discountAmount.toFixed(2)}</p>
                <p><strong>New total: $${displayTotal.toFixed(2)}</strong></p>`;
            discountInfo.style.display = 'block';
            // Change button to "Purchase"
            orderButton.textContent = "Purchase";
        } else {
            discountInfo.style.display = 'none';
            // Change button to "Order now"
            orderButton.textContent = "Order now";
        }

        // If quizScore is 0,1,2,3, show "no discount" message, then purchase
        if (typeof quizScore === 'number' && [0,1,2].includes(quizScore)) {
            setTimeout(() => {
                showNotification("Sorry, you didn't get a discount. Proceeding to purchase...");
                setTimeout(() => {
                    showNoDiscountPurchase();
                    quizScore = null;
                }, 2000); // Show message for 1.8s before purchase
            }, 500); // short delay to allow UI update
        }

        cartTotal.textContent = displayTotal.toFixed(2);
    }
    
    function removeFromCart(index) {
        if (index >= 0 && index < cartItems.length) {
            const removedItem = cartItems[index];
            cartItems.splice(index, 1);
            updateCart();
            showNotification(`${removedItem.name} removed from cart`);
        }
    }
    
    // After showing discount info (user won discount), also scroll to cart
    function showDiscountInfo(score, discount) {
        quizDiscount = discount;
        quizScore = score;
        updateCart();
        // Scroll to cart box after returning from quiz with discount
        document.querySelector('.cart').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function showOrderModal() {
        if (cartItems.length === 0) {
            showNotification("Your cart is empty. Add some items before ordering.");
            return;
        }
        orderItemsContainer.innerHTML = "";
        let total = 0;
        cartItems.forEach(item => {
            const orderItem = document.createElement("div");
            orderItem.className = "order-item";
            orderItem.innerHTML = `
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
            `;
            orderItemsContainer.appendChild(orderItem);
            total += item.price;
        });
        // Apply discount if available
        let displayTotal = total;
        if (quizDiscount) {
            const discountAmount = total * (quizDiscount / 100);
            displayTotal = total - discountAmount;
        }
        modalTotal.textContent = `$${displayTotal.toFixed(2)}`;
        confirmationModal.classList.add("active");
    }

    function confirmOrder() {
        let total = cartItems.reduce((sum, item) => sum + item.price, 0);
        let displayTotal = total;
        if (quizDiscount) {
            const discountAmount = total * (quizDiscount / 100);
            displayTotal = total - discountAmount;
        }
        confirmationModal.classList.remove("active");
        showNotification(`Order confirmed! Total: $${displayTotal.toFixed(2)}`);
        cartItems.length = 0;
        quizDiscount = null;
        quizScore = null;
        updateCart();
        discountInfo.style.display = 'none';
    }
    
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add("show");
        
        setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);
    }
    
    // Initialize cart
    updateCart();
    // Initialize cart
    updateCart();
    // Initialize cart
    updateCart();