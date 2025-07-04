// src/App.tsx
import React from 'react';
import Quadrant from './components/Quadrant';

const App: React.FC = () => {
  const userId = 1; // exemple utilisateur connecté

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Matrice d'Eisenhower</h2>
      <div className="row g-3">
        <div className="col-md-6">
          <Quadrant title="Urgent & Important" urgency="urgent" importance="important" userId={userId} />
        </div>
        <div className="col-md-6">
          <Quadrant title="Urgent & Non important" urgency="urgent" importance="non important" userId={userId} />
        </div>
        <div className="col-md-6">
          <Quadrant title="Non urgent & Important" urgency="non urgent" importance="important" userId={userId} />
        </div>
        <div className="col-md-6">
          <Quadrant title="Non urgent & Non important" urgency="non urgent" importance="non important" userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default App;
