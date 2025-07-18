import { useState, useEffect } from "react";
import { MachinesInterface } from "../../../interfaces/Machine";
import { Button, Modal, Select, message, Input, Form, Row, Col } from "antd";
import { GetAllMachine, CreateMachine, UpdateMachine, DeleteMachineById, CreateHistory, GetHistoryByMachineID } from "../../../services/https";
import machineImage from './Group 799.png';
import { HistoryInterface } from "../../../interfaces/IMachineHistory";
import EmployeeBar from '../../../Components/Nav_bar/EmployeeBar';
import EmSidebar from '../../../Components/Nav_bar/EmSidebar';

function AdminMachine() {
  const [machines, setMachines] = useState<MachinesInterface[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editMachine, setEditMachine] = useState<MachinesInterface | null>(null);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedMachineHistory, setSelectedMachineHistory] = useState<HistoryInterface[]>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Fetch all machines on component mount
  useEffect(() => {
    fetchMachines();
    document.body.style.backgroundColor = "#67B1D7";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const fetchMachines = async () => {
    try {
      const res = await GetAllMachine();
      if (res && res.status === 200) {
        setMachines(res.data);
      } else {
        message.error("Failed to fetch machines");
      }
    } catch (error) {
      console.error("Error fetching machines:", error);
      message.error("Error fetching machines");
    }
  };

  const detectChanges = (oldMachine: MachinesInterface, newMachine: MachinesInterface) => {
    const changes: Record<string, { old: any; new: any }> = {};
    Object.keys(newMachine).forEach((key) => {
      if ((newMachine as any)[key] !== (oldMachine as any)[key]) {
        changes[key] = {
          old: (oldMachine as any)[key],
          new: (newMachine as any)[key],
        };
      }
    });
    return changes;
  };
  

  const handleAddMachine = async (values: MachinesInterface) => {
    try {
      const payload = {
        ...values,
        capacity: parseFloat(values.capacity as unknown as string),
      };
      console.log("Payload to backend:", payload);
      const res = await CreateMachine(values);

      if (res?.success) {
        message.success(res.message || "Machine added successfully");
        const historyPayload: HistoryInterface = {
          machine_id: res.data.id, 
          action: "Created",
          timestamp: new Date().toISOString(),
          changes: JSON.stringify({})
        };
        const historyResponse = await CreateHistory(historyPayload);

        if (historyResponse?.success) {
          message.success("History record created successfully");
        }
        setMachines((prevMachines) => [...prevMachines, res.data]);
        setIsModalVisible(false);
        form.resetFields();
      } else {
        message.error(res?.message || "Failed to add machine. Unexpected server response.");
      }
    } catch (error) {
      console.error("Error adding machine:", error);
      message.error("Failed to add machine. Check console for details.");
    }
  };

  const handleUpdateMachine = async (values: MachinesInterface) => {
    if (!editMachine?.ID) return;
    try {
      const detectedChanges = detectChanges(editMachine, values);
      console.log("Detected Changes:", detectedChanges);
  
      const res = await UpdateMachine(editMachine.ID, values);
  
      if (res?.status === 200) {
        message.success("Machine updated successfully");
        fetchMachines(); 
        setIsModalVisible(false);
        setEditMachine(null);
      } else {
        message.error(res.data?.message || "Failed to update machine");
      }
    } catch (error) {
      console.error("Error updating machine:", error);
      message.error("Error updating machine");
    } finally {
      setLoading(false);
    }
  };
  

  const handleDeleteMachineById = async (id: number) => {
    try {
      const res = await DeleteMachineById(id);

      if (res?.status === 200 || res?.data?.success) { // Check for success
        message.success(res?.data?.message || "Machine deleted successfully");
        setMachines((prevMachines) => prevMachines.filter((machine) => machine.ID !== id));
      } else {
        message.error(res?.data?.error || "Failed to delete machine");
      }
    } catch (error) {
      console.error("Error deleting machine:", error);
      message.error("Error deleting machine");
    }
  };

  const showMachineHistory = async (machineID: number) => {
    try {
      const res = await GetHistoryByMachineID(machineID);
      if (res?.success) {
        const historyWithParsedChanges = res.data.map((history: HistoryInterface) => ({
          ...history,
          changes: history.changes ? JSON.parse(history.changes as string) : {}, 
        }));
        setSelectedMachineHistory(historyWithParsedChanges);
        setHistoryModalVisible(true);
      } else {
        message.error("Failed to fetch machine history.");
      }
    } catch (error) {
      console.error("Error fetching machine history:", error);
      message.error("Error fetching machine history.");
    }
  };
  
  

  const openModal = (machine?: MachinesInterface) => {
    if (machine) {
      setEditMachine(machine);
      form.setFieldsValue(machine);
    } else {
      setEditMachine(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditMachine(null);
    form.resetFields();
  };

  const handleSubmit = (values: MachinesInterface) => {
    if (editMachine) {
      handleUpdateMachine(values);
    } else {
      handleAddMachine(values);
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          zIndex: 10,
        }}
      >
        <EmployeeBar page={""} />
        <EmSidebar page={""} />
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "7%",
        }}
      >
        <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>Manage Machines</h3>
      </div>

      <Button
        type="primary"
        onClick={() => openModal()}
        style={{
          position: "fixed",
          top: "150px",
          right: "5%",
          transform: "translateX(50%)",
          zIndex: 11,
          width: "140px",
          height: "40px",
          backgroundColor: "#35A3D6",
          borderColor: "#35A3D6",
          color: "#FFFFFF",
          borderRadius: "20px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#00BBF0";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#35A3D6";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        Add Machine
      </Button>

      <Row
        gutter={[16, 16]}
        justify="center"
        style={{
          margin: "2% auto",
          padding: "1%",
          borderRadius: "16px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
          width: "90%",
          maxHeight: "65vh",
          overflowY: "auto",
        }}
      >
        {machines.map((machine) => (
          <Col xs={24} sm={12} md={8} lg={6} key={machine.ID}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: "20px",
                textAlign: "center",
                padding: "20px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                src={machineImage}
                alt="machine"
                style={{ width: "100px", height: "100px", marginBottom: "10px" }}
              />
              <h3 style={{ fontWeight: "bold", fontSize: "18px", margin: "5px 0" }}>{machine.machine_name}</h3>
              <p style={{ fontSize: "14px", color: "#666" }}>{machine.machine_type}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor:
                      machine.status === "ไม่ว่าง" ? "#F73859" : machine.status === "ซ่อมแซม" ? "#D9D9D9" : "#00FF00",
                    borderRadius: "50%",
                    marginRight: "8px",
                  }}
                ></span>
                <p style={{ fontSize: "14px", color: "#666" }}>Status: {machine.status}</p>
              </div>
              <p style={{ fontSize: "14px", color: "#666" }}>Model: {machine.m_model}</p>
              <p style={{ fontSize: "14px", color: "#666" }}>Brand: {machine.brand}</p>
              <p style={{ fontSize: "14px", color: "#666" }}>ความจุ: {machine.capacity} กิโลกรัม</p>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <Button
                  style={{
                    backgroundColor: "#35A3D6",
                    color: "#fff",
                    borderRadius: "12px",
                    border: "none",
                  }}
                  onClick={() => openModal(machine)}
                >
                  Edit
                </Button>
                <Button
                  danger
                  style={{
                    backgroundColor: "#F73859",
                    color: "#fff",
                    borderRadius: "12px",
                  }}
                  onClick={() => {
                    Modal.confirm({
                      title: "Are you sure you want to delete this machine?",
                      okText: "Yes",
                      okType: "danger",
                      cancelText: "Cancel",
                      onOk: () => handleDeleteMachineById(Number(machine.ID)),
                    });
                  }}
                >
                  Delete
                </Button>
                <Button
                  style={{
                    backgroundColor: "#FFAA00",
                    color: "#fff",
                    borderRadius: "12px",
                    border: "none",
                  }}
                  onClick={() => showMachineHistory(Number(machine.ID))}
                >
                  View History
                </Button>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Modal
        title="Machine History"
        visible={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={null}
      >
        {selectedMachineHistory.map((history, index) => (
          <div key={index} style={{ marginBottom: "16px" }}>
            <p><strong>Action:</strong> {history.action}</p>
            <p><strong>Timestamp:</strong> {new Date(history.timestamp).toLocaleString()}</p>
            <p><strong>Changes:</strong></p>
            <ul>
              {history.changes &&
              Object.entries(history.changes).map(([field, change]) => (
               <li key={field}>
                  <strong>{field}:</strong> {change.old} → {change.new}
               </li>
             ))}
            </ul>
          </div>
          ))}
        </Modal>


      <Modal
        title={editMachine ? "Edit Machine" : "Add Machine"}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        footer={null}
        centered
        style={{
          top: 80,
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Machine Name"
            name="machine_name"
            rules={[{ required: true, message: "Please enter the machine name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Machine Type"
            name="machine_type"
            rules={[{ required: true, message: "Please select the machine type" }]}
          >
            <Select>
              <Select.Option value="เครื่องซักผ้า">เครื่องซักผ้า</Select.Option>
              <Select.Option value="เครื่องอบผ้า">เครื่องอบผ้า</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select the status" }]}
          >
            <Select>
              <Select.Option value="ว่าง">ว่าง</Select.Option>
              <Select.Option value="ไม่ว่าง">ไม่ว่าง</Select.Option>
              <Select.Option value="ซ่อมแซม">ซ่อมแซม</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Model"
            name="m_model"
            rules={[{ required: true, message: "Please enter model" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Brand"
            name="brand"
            rules={[{ required: true, message: "Please enter brand" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Capacity"
            name="capacity"
            rules={[{ required: true, message: "Please enter capacity" }]}
          >
            <Input
              type="number" 
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                form.setFieldsValue({ capacity: isNaN(value) ? undefined : value });
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={loading}
              style={{
                width: "140px",
                height: "40px",
                backgroundColor: "#35A3D6",
                borderColor: "#35A3D6",
                fontWeight: "bold",
                color: "#FFFFFF",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#00BBF0";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#35A3D6";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {editMachine ? "Update Machine" : "Add Machine"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AdminMachine;
