// src/components/editor/RichTextEditor.jsx
import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill/dist/quill.snow.css';
import { motion } from 'framer-motion';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'image'
];

const RichTextEditor = ({ value, onChange, minHeight = '200px', maxHeight = '500px' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="rounded-lg border border-gray-300"
        style={{
          minHeight: minHeight,
          maxHeight: maxHeight,
          height: 'auto',
          overflowY: 'auto',
        }}
      />
    </motion.div>
  );
};

export default RichTextEditor;