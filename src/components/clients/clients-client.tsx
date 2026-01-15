'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Search, Trash2, UserPlus } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Client, Sale } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import AddClientForm from './add-client-form';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

export default function ClientsClient({ initialClients, sales }: { initialClients: Client[], sales: Sale[] }) {
  const [search, setSearch] = useState('');
  const [isAddClientOpen, setAddClientOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to changes in the clients table
    const clientsSubscription = supabase
      .channel('clients-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'clients' 
        }, 
        async (payload) => {
          // On INSERT, add the new client to state
          if (payload.eventType === 'INSERT') {
            const newClient = payload.new as Client;
            if (!clients.some(c => c.id === newClient.id)) {
              setClients(prev => [newClient, ...prev]);
            }
          }
          // On DELETE, remove the client from state
          else if (payload.eventType === 'DELETE') {
            const deletedClientId = payload.old.id;
            setClients(prev => prev.filter(client => client.id !== deletedClientId));
          }
          // On UPDATE, update the client in state
          else if (payload.eventType === 'UPDATE') {
            const updatedClient = payload.new as Client;
            setClients(prev => prev.map(client => 
              client.id === updatedClient.id ? updatedClient : client
            ));
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      clientsSubscription.unsubscribe();
    };
  }, []);

  // Initialize clients state when initialClients prop changes
  useEffect(() => {
    setClients(initialClients);
  }, [initialClients]);

  const handleAddClient = async (newClientData: Omit<Client, 'id'>) => {
    try {
        const response = await fetch('/api/clients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newClientData),
        });
        if (!response.ok) throw new Error('Failed to add client');
        const newClient = await response.json();
        
        // Avoid adding duplicates if client already exists
        if (!clients.some(c => c.email === newClient.email)) {
            setClients((prev) => [newClient, ...prev]);
        }
        
        setAddClientOpen(false);
        toast({ title: 'Success', description: 'Client added successfully.' });
    } catch (error) {
        toast({ title: 'Error', description: 'Could not add client.', variant: 'destructive' });
    }
  };
  
  const handleDeleteClient = async (clientEmail: string) => {
    try {
        const response = await fetch('/api/clients', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: clientEmail }),
        });
        if (!response.ok) throw new Error('Failed to delete client');
        setClients((prev) => prev.filter(client => client.email !== clientEmail));
        toast({ title: 'Success', description: 'Client deleted successfully.' });
    } catch (error) {
        toast({ title: 'Error', description: 'Could not delete client. It may be associated with sales or loans.', variant: 'destructive' });
    }
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.includes(search)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Clients</CardTitle>
            <CardDescription>
              Manage your clients and view their purchase history.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search clients..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Dialog open={isAddClientOpen} onOpenChange={setAddClientOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9 gap-1">
                  <UserPlus className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Client
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Client</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new client.
                  </DialogDescription>
                </DialogHeader>
                <AddClientForm onAddClient={handleAddClient} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.email}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive h-8 w-8"
                        aria-label={`Delete client ${client.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete client</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this client?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. If the client is associated with sales or loans, the operation will fail.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteClient(client.email)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
