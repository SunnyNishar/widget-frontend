'use client';
import { useState } from 'react';
import FeedDisplay from './components/FeedDisplay';
import Sidebar from './components/sidebar';
import WidgetForm from './components/widegtform';
import styles from './page.module.css';

export default function Home() {
  const [selectedFolderId, setSelectedFolderId] = useState(''); // moved up!

  return (
    <main className={styles.container}>
      <Sidebar />
      <WidgetForm 
        setSelectedFolderId={setSelectedFolderId} 
        selectedFolderId={selectedFolderId} 
      />
      <FeedDisplay folderId={selectedFolderId} />
    </main>
  );
}
