import {IoMdAdd} from "react-icons/io";
import {FaCheck, FaMinus} from "react-icons/fa6";
import {RiDeleteBin6Line} from "react-icons/ri";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {shopCreateURL, productCreateURL, shopsURL, productsURL, productUpdateURL, memberShopsURL, productDeleteURL, shopDeleteURL} from "../routes/Url";
import toast from "react-hot-toast";
import {useGlobal} from "../context/GlobalStete";
import {FiLogOut} from "react-icons/fi";
import Swal from "sweetalert2";
const Shops = () => {
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [shop_name, setShopName] = useState("");
  const {current_user} = useGlobal();
  const [shops, setShops] = useState([]);
  const shop_id = localStorage.getItem("SelectedShopId");
  const nav = useNavigate();
  useEffect(() => {
    if (shop_id != null) {
      setSelectedShopId(shop_id);
    }
  }, [shop_id]);

  const token = localStorage.getItem("token");
  const role = current_user.role;
  const isAdmin = role == "admin";

  const [productStates, setProductStates] = useState({});

  const handleProductChange = (id, field, value) => {
    if (value < 0) value = 1;
    setProductStates((prev) => ({
      ...prev,
      [id]: {...prev[id], [field]: value},
    }));
  };

  const handleProductClick = (id, field, delta) => {
    setProductStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: (prev[id]?.[field] || 0) + delta < 0 ? 0 : (prev[id]?.[field] || 0) + delta,
      },
    }));
  };

  useEffect(() => {
    let url = shopsURL;
    if (!isAdmin) return;
    if (current_user.role != "admin" && current_user.role != "member") return;
    if (current_user.role == "member") {
      url = memberShopsURL + `/${current_user._id}`;
    }
    axios
      .get(url, {headers: {Authorization: "Bearer " + token}})
      .then((res) => {
        setShops(res.data.shops);
      })
      .catch((e) => {
        toast.error(e.message);
      });
  }, []);

  const handleShopClick = (id) => {
    setSelectedShopId(id);
    axios
      .get(productsURL + "/" + id, {headers: {Authorization: "Bearer " + token}})
      .then((res) => {
        if (res.data.products) setProducts(res.data.products);
        else {
          toast.success("No Product Found!");
        }
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  useEffect(() => {
    if (!selectedShopId) return;
    axios
      .get(productsURL + "/" + selectedShopId, {headers: {Authorization: "Bearer " + token}})
      .then((res) => {
        if (res.data.products) setProducts(res.data.products);
        else {
          toast.success("No Product Found!");
        }
      })
      .catch((e) => {
        toast.error(e.message);
      });
  }, [selectedShopId]);

  const handleCreateShop = (e) => {
    if (e.keyCode == 13) {
      axios
        .post(shopCreateURL, {shop_name}, {headers: {Authorization: "Bearer " + token}})
        .then((res) => {
          setShopName("");
          setShops((prev) => [...prev, res.data.shops]);
        })
        .catch((e) => {
          toast.error(e.response.data.message);
        });
    }
  };
  const handleProductCreate = (e) => {
    if (e.keyCode == 13) {
      axios
        .post(productCreateURL, {shop_id: selectedShopId, product_name: productName}, {headers: {Authorization: "Bearer " + token}})
        .then((res) => {
          setProductName("");
          setProducts((prev) => [...prev, res.data.products]);
        })
        .catch((e) => {
          toast.error(e.response.data.message);
        });
    }
  };
  const handleProductUpdate = (id) => {
    Swal.fire({
      title: "Do you really want to updete?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(productUpdateURL, {id, wastage: productStates[id]?.wastage || 0, baked: productStates[id]?.baked || 0}, {headers: {Authorization: "Bearer " + token}})
          .then((res) => {
            toast.success("Product changes have been saved!");
          })
          .catch((e) => {
            toast.error(e.response.data.message);
          });
      }
    });
  };
  useEffect(() => {
    const initialState = {};
    products.forEach((product) => {
      initialState[product._id] = {
        baked: product.baked,
        wastage: product.wastage,
      };
    });
    setProductStates(initialState);
  }, [products]);

  const handleProductDelete = (id) => {
    Swal.fire({
      title: "Do you really want to delete?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(productDeleteURL, {data: {id}, headers: {Authorization: "Bearer " + token}})
          .then(() => {
            toast.success("Product has been deleted successfully!");
            setProducts((prev) => prev.filter((p) => p._id != id));
          })
          .catch((e) => {
            toast.error(e.response.data.message);
          });
      }
    });
  };
  const handleShopDelete = (shop) => {
    Swal.fire({
      title: "Do you really want to delete - " + shop.shop_name + "?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(shopDeleteURL, {data: {id: shop._id}, headers: {Authorization: "Bearer " + token}})
          .then(() => {
            toast.success(shop.shop_name + " has been deleted successfully!");
            if (selectedShopId == shop._id) {
              setSelectedShopId(null);
            }
            setShops((prev) => prev.filter((p) => p._id != shop._id));
          })
          .catch((e) => {
            toast.error(e.response.data.message);
          });
      }
    });
  };
  const logout = () => {
    localStorage.removeItem("token");
    if (role == "admin") {
      nav("/admin");
    } else {
      nav("/");
    }
  };
  return (
    <>
      <section className="shop-section p-6">
        {isAdmin ? (
          <>
            <div>
              <input value={shop_name} onChange={(e) => setShopName(e.target.value)} onKeyDown={handleCreateShop} className="mb-2 sticky top-0" type="text" placeholder="Enter shop name and press [Enter key] to add" />
            </div>
            <div className="shop-container max-h-[300px] overflow-auto ">
              <ul className="  shadow rounded  p-2">
                {shops && shops.length > 0 ? (
                  shops.map((shop, i) => (
                    <li
                      key={shop._id}
                      onClick={(e) => {
                        handleShopClick(shop._id);
                      }}
                      className={`flex justify-between items-center p-[4px] cursor-pointer border-dotted rounded   ${selectedShopId == shop._id ? "text-white bg-gray-600  " : "text-black-400 hover:text-gray-500 hover:bg-gray-100"}`}
                    >
                      <p className="font-semibold  ">
                        # {shop.seq} - {shop.shop_name}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShopDelete(shop);
                        }}
                        className="px-2 py-1   text-orange-400 rounded hover:bg-orange-200"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </li>
                  ))
                ) : (
                  <div className="empty-result">Empty shop</div>
                )}
              </ul>
            </div>
          </>
        ) : (
          ""
        )}

        {/* Product list table start */}

        <div className="product-list">
          {selectedShopId && isAdmin ? (
            <div>
              <input
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                }}
                onKeyDown={handleProductCreate}
                className="mb-2  sticky top-0"
                type="text"
                placeholder="Enter product name and press [Enter key] to add"
              />
            </div>
          ) : (
            <>
              {" "}
              <button onClick={logout} className=" mb-2 flex items-center gap-2 mt-4 py-2 px-4 bg-gray-100 text-gray-500 font-semibold rounded-lg hover:bg-red-100">
                Logout <FiLogOut />
              </button>
            </>
          )}
          {products.length > 0 ? (
            <div className="max-h-[300px] overflow-auto">
              <table>
                <thead>
                  <tr>
                    <th>Product id</th>
                    <th>Product name</th>
                    <th>Goods Baked</th>
                    <th>Wastage</th>
                    <th>Confirm</th>
                    {isAdmin ? <th>Del</th> : ""}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    return (
                      <tr key={product._id} className="hover:bg-gray-100">
                        <td># {product.seq}</td>
                        <td>{product.product_name}</td>
                        <td>
                          <div className="flex items-center justify-center">
                            <button onClick={() => handleProductClick(product._id, "baked", -1)} className=" px-4 py-4 bg-orange-100 text-orange-400 rounded hover:bg-orange-200">
                              <FaMinus />
                            </button>
                            <input type="number" onChange={(e) => handleProductChange(product._id, "baked", Number(e.target.value))} value={productStates[product._id]?.baked || product.baked} className="!w-16 !mt-0 text-center mx-2  border border-gray-300 rounded" />
                            <button onClick={() => handleProductClick(product._id, "baked", +1)} className=" px-4 py-4 bg-green-100 text-green-500 rounded hover:bg-green-200">
                              <IoMdAdd />
                            </button>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center justify-center">
                            <button onClick={() => handleProductClick(product._id, "wastage", -1)} className=" px-4 py-4 bg-orange-100 text-orange-400 rounded hover:bg-orange-200">
                              <FaMinus />
                            </button>
                            <input type="number" onChange={(e) => handleProductChange(product._id, "wastage", Number(e.target.value))} value={productStates[product._id]?.wastage || product.wastage} className="!w-16 !mt-0 text-center mx-2 border border-gray-300 rounded" />
                            <button onClick={() => handleProductClick(product._id, "wastage", 1)} className=" px-4 py-4 bg-green-100 text-green-500 rounded hover:bg-green-200">
                              <IoMdAdd />
                            </button>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => {
                                handleProductUpdate(product._id);
                              }}
                              className="px-4 py-4 bg-green-300 text-white rounded hover:bg-green-500"
                            >
                              <FaCheck />
                            </button>
                          </div>
                        </td>
                        {isAdmin ? (
                          <td>
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => {
                                  handleProductDelete(product._id);
                                }}
                                className="px-4 py-4 text-orange-400 rounded hover:bg-orange-200"
                              >
                                <RiDeleteBin6Line />
                              </button>
                            </div>
                          </td>
                        ) : (
                          ""
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-400 "></div>
          )}
        </div>
      </section>
    </>
  );
};

export default Shops;
