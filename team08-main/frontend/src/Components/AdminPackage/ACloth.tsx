import { useEffect, useState } from "react";
import { ClothType } from "../../interfaces/IClothType";
import {CreateClothType, UpdateClothType, DeleteClothType, GetClothTypesByPackageID,} from "../../services/https";
import { motion } from "framer-motion";
import { Button, Modal, Form, Input, message } from "antd";

interface CalculatorCloth {
    id: string;
    priceSelectedItemsChange: (selectedItems: number) => void;
    SelectedCloth: (selectedCloth: number[]) => void;
    detailClothselected: (detailCloth: ClothSelectedDetail[]) => void;
}

export interface ClothSelectedDetail {
    ID: number;
    quantity: number;
    price: number;
}

function Package({ id, priceSelectedItemsChange, SelectedCloth, detailClothselected }: CalculatorCloth) {
    const [cloth, setCloth] = useState<ClothType[]>([]);
    const [counts, setCounts] = useState<{ [key: number]: number }>({});
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [priceCloth, setPriceCloth] = useState<{ [key: number]: number }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCloth, setCurrentCloth] = useState<ClothType | null>(null);
    const [form] = Form.useForm();

    async function fetchClothes(id: number) {
        try {
            const res = await GetClothTypesByPackageID(id);
            setCloth(res);

            const initialCounts = res.reduce((acc: { [key: number]: number }, item:ClothType) => {
                acc[item.ID!] = 0;
                return acc;
            }, {});
            setCounts(initialCounts);
        } catch (error) {
            console.error("Error fetching cloth types:", error);
            message.error("Failed to fetch cloth types. Please try again.");
        }
    }

    useEffect(() => {
        fetchClothes(Number(id));
    }, []);

    useEffect(() => {
        const selectedClothDetails = cloth.filter((item) => selectedItems.includes(item.ID || 0));
        const calculatedTotalPrice = selectedClothDetails.reduce((total, item) => {
            const quantity = counts[item.ID || 0] || 0;
            return total + (item.Price || 0) * quantity;
        }, 0);

        updateClothDetail();
        priceSelectedItemsChange(calculatedTotalPrice); // Update the parent component with total price
    }, [counts, selectedItems, cloth]);

    const handleAdd = async (values: ClothType) => {
        const payload = { ...values, Price: Number(values.Price), PackageID: Number(id) };
    
        try {
            const response = await CreateClothType(payload);
            console.log("Created ClothType:", response.data);
    
            message.success("Cloth created successfully");
            fetchClothes(Number(id));
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error("Error creating cloth:", error);
            message.error("Failed to create cloth. Please check your input and try again.");
        }
    };
    
    
    
    

    const handleUpdate = async (values: ClothType) => {
        try {
            if (currentCloth?.ID) {
                const payload = { ...values, Price: Number(values.Price), PackageID: Number(id) };
                console.log("Payload being sent for update:", payload);
    
                await UpdateClothType(currentCloth.ID, payload);
                message.success("Cloth updated successfully");
                fetchClothes(Number(id));
                setIsModalOpen(false);
                form.resetFields();
            }
        } catch (error) {
            console.error("Error updating cloth:", error);
            message.error("Failed to update cloth. Please try again.");
        }
    };

    const handleDelete = async (clothId: number) => {
        try {
            await DeleteClothType(clothId);
            message.success("Cloth deleted successfully");
            fetchClothes(Number(id));
        } catch (error) {
            console.error("Error deleting cloth:", error);
            message.error("Failed to delete cloth. Please try again.");
        }
    };

    const handleCheckboxChange = (id: number) => {
        setSelectedItems((prevSelectedItems) => {
            const updatedItems = prevSelectedItems.includes(id)
                ? prevSelectedItems.filter((itemId) => itemId !== id)
                : [...prevSelectedItems, id];

            SelectedCloth(updatedItems);

            setCounts((prevCounts) => {
                const updatedCounts = { ...prevCounts };
                if (updatedItems.includes(id)) {
                    updatedCounts[id] = 1;
                    updatePriceCloth(id, 1);
                } else {
                    delete updatedCounts[id];
                }
                return updatedCounts;
            });
            return updatedItems;
        });
    };

    const updatePriceCloth = (id: number, quantity: number) => {
        const item = cloth.find((clothItem) => clothItem.ID === id);
        const totalPerType = (item?.Price || 0) * quantity;
        setPriceCloth((prev) => ({ ...prev, [id]: totalPerType }));
    };

    const updateClothDetail = () => {
        const selectedClothDetails = cloth
            .filter((item) => selectedItems.includes(item.ID || 0))
            .map((item) => ({
                ID: item.ID || 0,
                quantity: counts[item.ID || 0] || 0,
                price: (item.Price || 0) * (counts[item.ID || 0] || 0),
            }));

        detailClothselected(selectedClothDetails);
    };

    const openModal = (clothItem?: ClothType) => {
        setCurrentCloth(clothItem || null);
        if (clothItem) {
            form.setFieldsValue(clothItem);
        } else {
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    return (
        <>
            <div className="detail-package w-full">
                <div className="flex justify-end mb-4">
                    <Button type="primary" onClick={() => openModal()}>Add Cloth</Button>
                </div>
                <div className="w-full">
                    {cloth.map((item, index) => (
                        <motion.div
                            key={index}
                            className={`table-cloth w-full grid grid-cols-3 gap-7 px-5 my-2 h-[100px] rounded-xl shadow-md bg-white
                            ${selectedItems.includes(item.ID || 0) ? "outline outline-1 outline-[#00BBF0] custom-shadow " : ""}`}
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.ID || 0)}
                                    onChange={() => handleCheckboxChange(item.ID || 0)}
                                />
                                <p className="text-left text-lg ml-2">{item.TypeName}</p>
                            </div>
                            <div className="flex justify-center items-center">
                                <Button type="default" onClick={() => openModal(item)}>Edit</Button>
                                <Button onClick={() => handleDelete(item.ID!)}>Delete</Button>
                            </div>
                            <div className="flex justify-end items-center">
                                <p>{item.Price} THB</p>
                                {selectedItems.includes(item.ID || 0) && <p className="font-bold">{priceCloth[item.ID || 0]} THB</p>}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            <Modal
                title={currentCloth ? "Edit Cloth" : "Add Cloth"}
                visible={isModalOpen}
                onCancel={closeModal}
                footer={null}
            >
                <Form
                    form={form}
                    initialValues={currentCloth || { TypeName: "", Price: 0 }}
                    onFinish={currentCloth ? handleUpdate : handleAdd}
                >
                    <Form.Item
                        label="Cloth Type"
                        name="TypeName"
                        rules={[{ required: true, message: "Please input the cloth type!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Price"
                        name="Price"
                        rules={[{ required: true, message: "Please input the price!" },
                             ]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {currentCloth ? "Update" : "Create"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default Package;
