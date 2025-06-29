import Card from '../../../components/ui/Card';

const Sidebar = ({ tabs, activeTab, setActiveTab, greeting = 'bonjour x' }) => (
  <Card className="p-6">
    <div className="mb-6 text-lg font-semibold text-gray-700">
      {greeting}
    </div>
    <nav className="space-y-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab)}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
            ? 'bg-primary-100 text-primary-700'
            : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          <tab.icon className="h-5 w-5 mr-3" />
          {tab.name}
        </button>
      ))}
    </nav>
  </Card>
);

export default Sidebar; 