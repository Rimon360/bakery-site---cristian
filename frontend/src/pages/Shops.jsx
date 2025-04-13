import Products from "./Products";

const Shops = () => {
  return (
    <>
<section className="shop-section p-6">
  <div className="shop-container  mb-6">
    <ul className="shadow rounded p-2 max-h-300 overflow-auto" >
      <li className="flex justify-between items-center p-1  rounded-lg ">
        <p className="font-semibold">Shop 1</p>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          View products
        </button>
      </li> 
      <li className="flex justify-between items-center p-1  rounded-lg ">
        <p className="font-semibold">Shop 1</p>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          View products
        </button>
      </li> 
      <li className="flex justify-between items-center p-1  rounded-lg ">
        <p className="font-semibold">Shop 1</p>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          View products
        </button>
      </li> 
    </ul>
  </div> 
  <div className="product-list"> 
    <Products />
  </div>
</section>

    </>
  );
};

export default Shops;
