import React from 'react';

const TestApp = () => {
  console.log('TestApp está renderizando correctamente');
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-orange-600 mb-4">
          ¡SoFinance Web Funcionando! 🎉
        </h1>
        <p className="text-gray-600 mb-4">
          Tailwind CSS está funcionando correctamente en la versión web.
        </p>
        <div className="bg-orange-100 p-4 rounded-lg">
          <p className="text-orange-800">
            ✅ PostCSS configurado correctamente<br/>
            ✅ Tailwind CSS v4 funcionando<br/>
            ✅ Aplicación web lista
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestApp;
