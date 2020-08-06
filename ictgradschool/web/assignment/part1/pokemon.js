/* Base address for the Pokemon endpoints. Add the endpoint name and parameters onto this */
const ENDPOINT_BASE_URL = "https://trex-sandwich.com/pokesignment/";


/* TODO: Your code here */
window.addEventListener("load", function(){
 const hamburger  = document.querySelector('.hamburger');
     hamburger.addEventListener('click', function(){
    document.querySelectorAll('.nav_list').forEach(nav => nav.classList.toggle('navigation_list_onclick'));

});
})