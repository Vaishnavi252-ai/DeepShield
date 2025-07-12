import { useState } from 'react';

export default function UploadScanner() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    const route = (ext === 'mp4' || ext === 'mov') ? 'video' : 'image';

    const form = new FormData();
    form.append('file', file);

    const res = await fetch(`http://127.0.0.1:8000/scan/${route}`, {
      method: 'POST',
      body: form
    });
    setResult(await res.json());
  };

  return (
    <div className="p-6">
      <input type="file"
             onChange={e => setFile(e.target.files[0])}/>
      <button onClick={handleUpload}
              className="ml-3 px-4 py-2 bg-green-500 rounded text-white">
        Scan
      </button>

      {result && (
        <pre className="mt-4 bg-gray-100 p-4 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
