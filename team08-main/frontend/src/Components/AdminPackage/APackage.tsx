import { useEffect, useState } from "react";
import { PackageInterface } from "../../interfaces/IPackage";
import { GetAllPackage, CreatePackage, UpdatePackage, DeletePackage } from "../../services/https";
import { motion } from "framer-motion";
import { Button, Modal, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";

function APackage() {
    const [packages, setPackages] = useState<PackageInterface[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPackage, setCurrentPackage] = useState<PackageInterface | null>(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        setLoading(true); // Set loading to true before fetching
        try {
            const res = await GetAllPackage();
            setPackages(res); // Update state with fetched packages
        } catch (error) {
            console.error("Error fetching packages:", error);
            message.error("Failed to fetch packages. Please try again.");
        } finally {
            setLoading(false); // Stop loading after fetching
        }
    };

    const handleAddPackage = async (values: PackageInterface) => {
        try {
            await CreatePackage(values);
            await fetchPackages(); // Re-fetch the package list
            message.success("Package added successfully");
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error("Error adding package:", error);
            message.error("Failed to add package. Please try again.");
        }
    };

    const handleUpdatePackage = async (values: PackageInterface) => {
        if (!currentPackage?.ID) return;

        try {
            await UpdatePackage(currentPackage.ID, values);
            await fetchPackages(); // Re-fetch the package list
            message.success("Package updated successfully");
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error("Error updating package:", error);
            message.error("Failed to update package. Please try again.");
        }
    };

    const handleDeletePackage = async (id: number) => {
        Modal.confirm({
            title: "Are you sure you want to delete this package?",
            okText: "Yes",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
                try {
                    await DeletePackage(id);
                    await fetchPackages(); // Re-fetch the package list
                    message.success("Package deleted successfully");
                } catch (error) {
                    console.error("Error deleting package:", error);
                    message.error("Failed to delete package. Please try again.");
                }
            },
        });
    };

    const openModal = (pkg?: PackageInterface) => {
        setCurrentPackage(pkg || null);
        if (pkg) {
            form.setFieldsValue(pkg);
        } else {
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleSubmit = (values: PackageInterface) => {
        if (currentPackage) {
            handleUpdatePackage(values);
        } else {
            handleAddPackage(values);
        }
    };

    const GotoOrderDetail = (id: number) => {
        navigate(`/AdminPackageDetail/${id}`); // Navigate to the order detail page
    };

    return (
        <div className="content-service w-full h-auto px-5 mt-5">
            <div className="flex justify-end mb-4">
                <Button type="primary" onClick={() => openModal()}>เพิ่ม Package</Button>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <h2>Loading packages...</h2>
                </div>
            ) : (
                <div className="content-serve">
                    {packages.length === 0 ? (
                        <h1>No packages available</h1>
                    ) : (
                        <div className="w-full h-full flex flex-wrap gap-6">
                            {packages.map((pack, index) => {
                                const bgColor =
                                    index % 5 === 1
                                        ? "from-blue-400 to-blue-600"
                                        : index % 5 === 2
                                        ? "from-red-400 to-[#F73859]"
                                        : index % 5 === 3
                                        ? "from-[#484C51] to-[#24292E]"
                                        : index % 5 === 4
                                        ? "from-green-400 to-green-600"
                                        : "from-cyan-400 to-sky-400";

                                const Shadow =
                                    index % 4 === 1
                                        ? "shadow-[0px_1px_16px_-6px_rgba(41,_104,_236,_1)]"
                                        : index % 4 === 2
                                        ? "shadow-[0px_1px_16px_-6px_rgba(247,_56,_89,_1)]"
                                        : index % 4 === 3
                                        ? "shadow-[0px_1px_16px_-6px_rgba(72,_76,_81,_1)]"
                                        : index % 4 === 4
                                        ? "shadow-[0px_1px_16px_-6px_rgba(26,_167,_78,_1)]"
                                        : "shadow-[0px_1px_16px_-6px_rgba(49,_187,_236,_1)]";

                                return (
                                    <motion.div
                                        className={`box1 bg-gradient-to-tl ${bgColor} rounded-xl box-drop ${Shadow} h-[250px] w-[250px] px-1`}
                                        key={index}
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <div className="h-full flex items-center justify-center">
                                            <div className="detail">
                                                <div className="model w-full h-full flex justify-center">
                                                    <img
                                                        src="../icon/sneakers_1334203.png"
                                                        alt=""
                                                        className="w-[100px] h-[100px] drop-shadow-lg"
                                                    />
                                                </div>
                                                <p className="font-bold text-center text-white mt-5">
                                                    {pack.PackageName}
                                                </p>
                                                <div className="px-2 my-2">
                                                    <p className="text-white text-wrap text-sm h-[30px]">
                                                        {pack.Explain}
                                                    </p>
                                                </div>
                                                <div className="flex justify-center gap-2">
                                                    <Button type="default" onClick={() => openModal(pack)}>
                                                        Edit
                                                    </Button>
                                                    <Button type="default" danger onClick={() => handleDeletePackage(pack.ID)}>
                                                        Delete
                                                    </Button>
                                                    <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        onClick={() => GotoOrderDetail(pack.ID!)}
                                                        className="border-2 rounded px-4 opacity-100 text-md normal-case font-normal text-white bg-transparent border-current cursor-pointer"
                                                    >
                                                        สร้าง Order
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
            <Modal
                title={currentPackage ? "Edit Package" : "Add Package"}
                visible={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    initialValues={currentPackage || { PackageName: "", Explain: "", Price: 0 }}
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Package Name"
                        name="PackageName"
                        rules={[{ required: true, message: "Please input the package name!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="Explain"
                        rules={[{ required: true, message: "Please input the description!" }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {currentPackage ? "Update" : "Create"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default APackage;
