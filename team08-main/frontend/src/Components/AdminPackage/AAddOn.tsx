import { useEffect, useState } from "react";
import { AddOnInterface } from "../../interfaces/IAddOn";
import { GetAddOnsByPackageID, CreateAddOn, UpdateAddOn, DeleteAddOn } from "../../services/https";
import { motion } from "framer-motion";
import { Button, Modal, Form, Input, InputNumber, message } from "antd";

interface AAddOnProps {
  id: string;
  priceSelectedAddOnChange: (selectedItems: number) => void;
  SelectedAddOn: (selectedAddOn: number[]) => void;
  AddOnItem: (AddonItem: AddOnInterface[]) => void;
}

function AAddOn({ id, priceSelectedAddOnChange, SelectedAddOn, AddOnItem }: AAddOnProps) {
  const [addons, setAddons] = useState<AddOnInterface[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAddOn, setCurrentAddOn] = useState<AddOnInterface | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAddOns(Number(id));
  }, [id]);

  const fetchAddOns = async (id: number) => {
    try {
      const res = await GetAddOnsByPackageID(id);
      const data = res.data;
      setAddons(Array.isArray(data) ? data : []);
      AddOnItem(data);
    } catch (error) {
      console.error("Error fetching add-ons:", error);
      message.error("Failed to fetch add-ons. Please try again.");
      setAddons([]);
    }
  };

  useEffect(() => {
    const selectedAddOnDetails = addons.filter((item) => selectedAddOns.includes(item.ID || 0));
    const calculatedTotalPrice = selectedAddOnDetails.reduce((total, item) => {
      return total + (item.Price || 0);
    }, 0);
    priceSelectedAddOnChange(calculatedTotalPrice);
  }, [selectedAddOns, addons]);

  const handleAddOnSelection = (id: number) => {
    setSelectedAddOns((prevSelected) => {
      const isSelected = prevSelected.includes(id);
      const updatedSelection = isSelected
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id];
      SelectedAddOn(updatedSelection);
      return updatedSelection;
    });
  };

  const openModal = (addOn?: AddOnInterface) => {
    setCurrentAddOn(addOn || null);
    if (addOn) form.setFieldsValue(addOn);
    else form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values: AddOnInterface) => {
    try {
      if (currentAddOn) {
        await UpdateAddOn(currentAddOn.ID!, { ...values, PackageID: Number(id) });
        message.success("Add-On updated successfully");
      } else {
        await CreateAddOn({ ...values, PackageID: Number(id) });
        message.success("Add-On created successfully");
      }
      fetchAddOns(Number(id));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving add-on:", error);
      message.error("Failed to save add-on. Please try again.");
    }
  };

  const handleDelete = async (addOnID: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this add-on?",
      okText: "Yes",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await DeleteAddOn(addOnID);
          message.success("Add-On deleted successfully");
          fetchAddOns(Number(id));
        } catch (error) {
          console.error("Error deleting add-on:", error);
          message.error("Failed to delete add-on. Please try again.");
        }
      },
    });
  };

  return (
    <div className="detail-package w-full">
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={() => openModal()}>Add Add-On</Button>
      </div>
      <div className="w-full">
        {addons.map((addon, index) => (
          <motion.div
            key={index}
            className={`table-addon w-full grid grid-cols-3 gap-7 px-5 my-2 h-[100px] rounded-xl shadow-md bg-white
            ${selectedAddOns.includes(addon.ID || 0) ? "outline outline-1 outline-[#00BBF0] custom-shadow " : ""}`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Add-On Name and Description */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedAddOns.includes(addon.ID || 0)}
                onChange={() => handleAddOnSelection(addon.ID || 0)}
              />
              <div className="ml-4">
                <p className="text-lg font-semibold">{addon.AddOnName}</p>
                <p className="text-sm text-gray-500">{addon.Description}</p>
              </div>
            </div>

            {/* Price */}
            <div className="flex justify-center items-center">
              <p className="text-lg">{addon.Price} THB</p>
            </div>

            {/* Edit/Delete Buttons */}
            <div className="flex justify-end items-center">
              <Button type="default" onClick={() => openModal(addon)}>Edit</Button>
              <Button danger onClick={() => handleDelete(addon.ID!)} className="ml-2">Delete</Button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal
        title={currentAddOn ? "Edit Add-On" : "Add Add-On"}
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="AddOnName"
            rules={[{ required: true, message: "Please enter the add-on name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="Description"
            rules={[{ required: true, message: "Please enter the description" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="Price"
            rules={[
              { required: true, message: "Please enter the price" },
              { type: "number", min: 1, message: "Price must be greater than zero" },
            ]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentAddOn ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AAddOn;