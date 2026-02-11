import { createFileRoute } from "@tanstack/react-router";
import { ReactFlow, Handle, Position, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useState, useMemo } from "react";
import { Router, Network, Shield, X } from "lucide-react";

export const Route = createFileRoute("/(root)/_root/network")({
  component: NetworkRoute,
});

type NetworkDevice = {
  id: string;
  name: string;
  type: "router" | "switch" | "firewall";
  location: string;
  vlans: string[];
};

function NetworkNode({ data }: { data: { label: string; type: string } }) {
  const config = {
    router: {
      color: "bg-blue-500",
      icon: <Router className="h-5 w-5 text-white" />,
    },
    switch: {
      color: "bg-green-500",
      icon: <Network className="h-5 w-5 text-white" />,
    },
    firewall: {
      color: "bg-red-500",
      icon: <Shield className="h-5 w-5 text-white" />,
    },
  };

  const deviceType = (data.type as keyof typeof config) || "switch";
  const { color, icon } = config[deviceType];

  return (
    <div className={`rounded-lg px-3 py-2 text-white ${color}`}>
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  network: NetworkNode,
};

function NetworkRoute() {
  const [devices, setDevices] = useState<NetworkDevice[]>([
    {
      id: "1",
      name: "Router Główny",
      type: "router",
      location: "Serwerownia",
      vlans: ["10", "20"],
    },
    {
      id: "2",
      name: "Switch Piętro 2",
      type: "switch",
      location: "Budynek A – Piętro 2",
      vlans: ["10"],
    },
  ]);

  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: "",
    type: "switch" as "router" | "switch" | "firewall",
    location: "",
  });

  const nodes: Node[] = useMemo(
    () =>
      devices.map((device, index) => ({
        id: device.id,
        type: "network",
        position: { x: 150 + index * 220, y: 200 },
        data: {
          label: device.name,
          type: device.type,
        },
      })),
    [devices],
  );

  const edges: Edge[] = useMemo(() => {
    const edgeList: Edge[] = [];
    for (let i = 0; i < devices.length - 1; i++) {
      edgeList.push({
        id: `e${devices[i].id}-${devices[i + 1].id}`,
        source: devices[i].id,
        target: devices[i + 1].id,
      });
    }
    return edgeList;
  }, [devices]);

  const handleAddDevice = () => {
    if (!newDevice.name.trim() || !newDevice.location.trim()) {
      alert("Wypełnij wszystkie pola!");
      return;
    }

    const id = Date.now().toString();

    setDevices((prev) => [
      ...prev,
      {
        id,
        name: newDevice.name,
        type: newDevice.type,
        location: newDevice.location,
        vlans: [],
      },
    ]);

    setNewDevice({ name: "", type: "switch", location: "" });
    setIsAdding(false);
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)]">
      <div className="w-64 border-r p-4 space-y-2 overflow-y-auto">
        <button onClick={() => setIsAdding(true)} className="w-full mb-4 rounded-md bg-blue-600 text-white p-2 hover:bg-blue-700 transition">
          + Dodaj urządzenie
        </button>

        <h2 className="font-semibold text-lg">Urządzenia</h2>

        {devices.map((device) => (
          <button
            key={device.id}
            onClick={() => setSelectedDevice(device)}
            className={`w-full text-left rounded-md border p-2 hover:bg-gray-100 transition ${selectedDevice?.id === device.id ? "bg-blue-50 border-blue-500" : ""}`}
          >
            <div className="font-medium">{device.name}</div>
            <div className="text-xs text-gray-500">{device.type}</div>
          </button>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 space-y-4">
            <h2 className="text-lg font-semibold">Dodaj urządzenie</h2>

            <input className="w-full border rounded-md p-2" placeholder="Nazwa urządzenia *" value={newDevice.name} onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })} />

            <input className="w-full border rounded-md p-2" placeholder="Lokalizacja *" value={newDevice.location} onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })} />

            <select
              className="w-full border rounded-md p-2"
              value={newDevice.type}
              onChange={(e) =>
                setNewDevice({
                  ...newDevice,
                  type: e.target.value as "router" | "switch" | "firewall",
                })
              }
            >
              <option value="router">Router</option>
              <option value="switch">Switch</option>
              <option value="firewall">Firewall</option>
            </select>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewDevice({ name: "", type: "switch", location: "" });
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Anuluj
              </button>

              <button onClick={handleAddDevice} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Dodaj
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          style={{ width: "100%", height: "100%" }}
          onNodeClick={(_, node) => {
            const device = devices.find((d) => d.id === node.id);
            if (device) setSelectedDevice(device);
          }}
        />
      </div>

      {selectedDevice && (
        <div className="w-80 border-l p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Szczegóły urządzenia</h2>
            <button onClick={() => setSelectedDevice(null)} className="text-gray-500 hover:text-gray-700">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <strong className="text-sm text-gray-600">Nazwa:</strong>
              <p>{selectedDevice.name}</p>
            </div>
            <div>
              <strong className="text-sm text-gray-600">Typ:</strong>
              <p className="capitalize">{selectedDevice.type}</p>
            </div>
            <div>
              <strong className="text-sm text-gray-600">Lokalizacja:</strong>
              <p>{selectedDevice.location}</p>
            </div>
            <div>
              <strong className="text-sm text-gray-600">VLAN:</strong>
              <p>{selectedDevice.vlans.length > 0 ? selectedDevice.vlans.join(", ") : "Brak"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
