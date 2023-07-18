import React from "react";
const ListItems = ({ items, onSelect }) => {
  { 
  return (
    items && items.length > 0?
    <ul className="dropdown-menu show">
    { 
 
     items.map((item, index) => (
    <li key={(index)}   className="dropdown-item"
        onClick={() => onSelect(item, index)}
      >

       {item}
    </li>

   ))
    } 
    </ul>:null
  );
   
  };
}
  
  export default ListItems;
  