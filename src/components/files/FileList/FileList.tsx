/**
 * File list component for displaying uploaded files
 */

"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Download,
  File,
  Image,
  FileText,
  Calendar,
  HardDrive,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import styles from "./FileList.module.scss";

interface FileInfo {
  fileName: string;
  originalName: string;
  size: number;
  uploadDate: string;
  modifiedDate: string;
}

interface FileListProps {
  className?: string;
  refreshTrigger?: number; // Добавляем триггер для обновления
}

export const FileList: React.FC<FileListProps> = ({
  className,
  refreshTrigger,
}) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/files");
      const data = await response.json();

      if (data.success) {
        setFiles(data.files);
        setError(null);
      } else {
        setError(data.message || "Ошибка при загрузке файлов");
      }
    } catch (err) {
      setError("Ошибка при загрузке файлов");
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Обновляем список файлов при изменении refreshTrigger
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchFiles();
    }
  }, [refreshTrigger]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <Image size={20} aria-label="Image file" />;
      case "pdf":
      case "txt":
        return <FileText size={20} />;
      default:
        return <File size={20} />;
    }
  };

  const handleDownload = (fileName: string, originalName: string) => {
    const link = document.createElement("a");
    link.href = `/api/files/${fileName}`;
    link.download = originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Card className={className}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Загрузка файлов...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <div className={styles.error}>
          <p>{error}</p>
          <Button onClick={fetchFiles} variant="outline">
            Попробовать снова
          </Button>
        </div>
      </Card>
    );
  }

  if (files.length === 0) {
    return (
      <Card className={className}>
        <div className={styles.empty}>
          <File size={48} />
          <h3>Файлы не найдены</h3>
          <p>Загруженные файлы будут отображаться здесь</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className={styles.header}>
        <h3>Загруженные файлы</h3>
        <Button onClick={fetchFiles} variant="outline" size="sm">
          Обновить
        </Button>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <File size={16} />
          <span>Всего файлов: {files.length}</span>
        </div>
        <div className={styles.stat}>
          <HardDrive size={16} />
          <span>
            Общий размер:{" "}
            {formatFileSize(
              files.reduce((total, file) => total + file.size, 0),
            )}
          </span>
        </div>
      </div>

      <div className={styles.fileList}>
        {files.map((file) => (
          <div key={file.fileName} className={styles.fileItem}>
            <div className={styles.fileInfo}>
              <div className={styles.fileIcon}>
                {getFileIcon(file.fileName)}
              </div>
              <div className={styles.fileDetails}>
                <h4>{file.originalName}</h4>
                <div className={styles.fileMeta}>
                  <span className={styles.fileSize}>
                    {formatFileSize(file.size)}
                  </span>
                  <span className={styles.uploadDate}>
                    <Calendar size={12} />
                    {formatDate(new Date(file.uploadDate))}
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => handleDownload(file.fileName, file.originalName)}
              variant="outline"
              size="sm"
              leftIcon={<Download size={16} />}
            >
              Скачать
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};
