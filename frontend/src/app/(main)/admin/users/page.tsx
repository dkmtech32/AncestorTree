/**
 * @project AncestorTree
 * @file src/app/(main)/admin/users/page.tsx
 * @description User management page for admins - with real Supabase data
 * @version 2.0.0 - Sprint 3
 * @updated 2026-02-24
 */

'use client';

import { useState } from 'react';
import { useProfiles, useUpdateUserRole } from '@/hooks/use-profiles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Users, ArrowLeft, Shield, UserCog, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import type { UserRole } from '@/types';

const roleLabels: Record<UserRole, { label: string; color: string; description: string }> = {
  admin: { 
    label: 'Quản trị viên', 
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    description: 'Toàn quyền quản trị hệ thống'
  },
  editor: { 
    label: 'Biên tập viên', 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    description: 'Thêm, sửa, xóa dữ liệu thành viên'
  },
  viewer: { 
    label: 'Người xem', 
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    description: 'Chỉ xem thông tin, không chỉnh sửa'
  },
};

export default function UsersPage() {
  const { data: profiles, isLoading, error } = useProfiles();
  const updateRole = useUpdateUserRole();
  
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: string;
    currentRole: UserRole;
    newRole: UserRole;
    userName: string;
  } | null>(null);

  const handleRoleChange = (userId: string, newRole: UserRole, currentRole: UserRole, userName: string) => {
    if (newRole === currentRole) return;
    setConfirmDialog({ open: true, userId, currentRole, newRole, userName });
  };

  const confirmRoleChange = async () => {
    if (!confirmDialog) return;
    
    try {
      await updateRole.mutateAsync({
        userId: confirmDialog.userId,
        role: confirmDialog.newRole,
      });
      toast.success(`Đã cập nhật quyền cho ${confirmDialog.userName}`);
    } catch (err) {
      toast.error('Lỗi khi cập nhật quyền');
      console.error(err);
    } finally {
      setConfirmDialog(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quản trị
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <UserCog className="h-6 w-6" />
              Quản lý người dùng
            </h1>
            <p className="text-muted-foreground">
              Phân quyền và quản lý tài khoản
            </p>
          </div>
        </div>
      </div>

      {/* Role Legend */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Cấp độ phân quyền
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.entries(roleLabels) as [UserRole, typeof roleLabels[UserRole]][]).map(([role, info]) => (
              <div key={role} className="flex items-start gap-3 p-3 rounded-lg border">
                <Badge className={info.color}>{info.label}</Badge>
                <span className="text-sm text-muted-foreground">{info.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Danh sách người dùng
          </CardTitle>
          <CardDescription>
            {isLoading ? 'Đang tải...' : `${profiles?.length || 0} người dùng đã đăng ký`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-9 w-32" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-8 text-center text-destructive">
              <p>Lỗi khi tải danh sách: {error.message}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            </div>
          ) : profiles && profiles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead className="hidden md:table-cell">Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>
                            {(user.full_name || user.email).charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {user.full_name || 'Chưa cập nhật'}
                          </p>
                          <p className="text-xs text-muted-foreground sm:hidden">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge className={roleLabels[user.role].color}>
                        {roleLabels[user.role].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={user.role}
                        onValueChange={(value) => 
                          handleRoleChange(
                            user.user_id, 
                            value as UserRole, 
                            user.role,
                            user.full_name || user.email
                          )
                        }
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-red-500" />
                              Quản trị viên
                            </span>
                          </SelectItem>
                          <SelectItem value="editor">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-blue-500" />
                              Biên tập viên
                            </span>
                          </SelectItem>
                          <SelectItem value="viewer">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-gray-500" />
                              Người xem
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Chưa có người dùng nào đăng ký</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <AlertDialog open={confirmDialog?.open} onOpenChange={(open) => !open && setConfirmDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận thay đổi quyền</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn thay đổi quyền của <strong>{confirmDialog?.userName}</strong> từ{' '}
              <Badge className={roleLabels[confirmDialog?.currentRole || 'viewer'].color}>
                {roleLabels[confirmDialog?.currentRole || 'viewer'].label}
              </Badge>{' '}
              sang{' '}
              <Badge className={roleLabels[confirmDialog?.newRole || 'viewer'].color}>
                {roleLabels[confirmDialog?.newRole || 'viewer'].label}
              </Badge>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange} disabled={updateRole.isPending}>
              {updateRole.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Xác nhận
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
