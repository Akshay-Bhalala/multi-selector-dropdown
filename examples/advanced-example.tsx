import React, { useState } from 'react';
import MultiSelectorDropdown from '../src/MultiSelectorDropdown';
import { Option } from '../src/types';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const AdvancedExample: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<Option[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Option[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);

  // Mock API function for adding new users
  const handleAddNewUser = async (value: string): Promise<Option | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: `user-${Date.now()}`,
      label: value,
      type: 'user'
    };
  };

  // Mock API function for adding new products
  const handleAddNewProduct = async (value: string): Promise<Option | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: `product-${Date.now()}`,
      label: value,
      type: 'product'
    };
  };

  // Mock API function for adding new categories
  const handleAddNewCategory = async (value: string): Promise<Option | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: `category-${Date.now()}`,
      label: value,
      type: 'category'
    };
  };

  const handleUserChange = (options: Option[]) => {
    setSelectedUsers(options);
    console.log('Selected users:', options);
  };

  const handleProductChange = (options: Option[]) => {
    setSelectedProducts(options);
    console.log('Selected products:', options);
  };

  const handleCategoryChange = (options: Option[]) => {
    setSelectedCategories(options);
    console.log('Selected categories:', options);
  };

  return (
    <div className="container mt-5">
      <h2>Multi-Selector Dropdown - Advanced Example</h2>
      <p className="text-muted">
        This example demonstrates advanced features including multiple dropdowns, 
        different configurations, and complex state management.
      </p>
      
      <div className="row">
        <div className="col-md-4">
          <h4>Users Dropdown</h4>
          <MultiSelectorDropdown
            apiUrl="https://jsonplaceholder.typicode.com/users"
            placeholder="Search and select users..."
            label="Select Users"
            required={true}
            allowAddNew={true}
            addNewPrefix="Add new user: "
            onAddNew={handleAddNewUser}
            onChange={handleUserChange}
            multiple={true}
            maxSelections={3}
            clearButton={true}
            size="sm"
            error=""
            touched={false}
          />
        </div>

        <div className="col-md-4">
          <h4>Products Dropdown</h4>
          <MultiSelectorDropdown
            apiUrl="https://jsonplaceholder.typicode.com/posts"
            placeholder="Search and select products..."
            label="Select Products"
            required={false}
            allowAddNew={true}
            addNewPrefix="Add new product: "
            onAddNew={handleAddNewProduct}
            onChange={handleProductChange}
            multiple={true}
            maxSelections={5}
            clearButton={true}
            size="md"
            error=""
            touched={false}
          />
        </div>

        <div className="col-md-4">
          <h4>Categories Dropdown</h4>
          <MultiSelectorDropdown
            apiUrl="https://jsonplaceholder.typicode.com/albums"
            placeholder="Search and select categories..."
            label="Select Categories"
            required={false}
            allowAddNew={true}
            addNewPrefix="Add new category: "
            onAddNew={handleAddNewCategory}
            onChange={handleCategoryChange}
            multiple={false}
            clearButton={true}
            size="lg"
            error=""
            touched={false}
          />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-4">
          <h5>Selected Users ({selectedUsers.length})</h5>
          <ul className="list-group">
            {selectedUsers.map((user) => (
              <li key={user.id} className="list-group-item">
                <strong>ID:</strong> {user.id} | <strong>Name:</strong> {user.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-4">
          <h5>Selected Products ({selectedProducts.length})</h5>
          <ul className="list-group">
            {selectedProducts.map((product) => (
              <li key={product.id} className="list-group-item">
                <strong>ID:</strong> {product.id} | <strong>Name:</strong> {product.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-4">
          <h5>Selected Categories ({selectedCategories.length})</h5>
          <ul className="list-group">
            {selectedCategories.map((category) => (
              <li key={category.id} className="list-group-item">
                <strong>ID:</strong> {category.id} | <strong>Name:</strong> {category.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <h4>Summary</h4>
        <div className="alert alert-info">
          <strong>Total Selected Items:</strong> {selectedUsers.length + selectedProducts.length + selectedCategories.length}
          <br />
          <strong>Users:</strong> {selectedUsers.length} | 
          <strong>Products:</strong> {selectedProducts.length} | 
          <strong>Categories:</strong> {selectedCategories.length}
        </div>
      </div>
    </div>
  );
};

export default AdvancedExample; 