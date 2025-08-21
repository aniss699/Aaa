
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Clock, Plus, X, Euro } from 'lucide-react';

interface TimeSlot {
  start: string;
  end: string;
  rate: number;
}

interface DayAvailability {
  date: Date;
  slots: TimeSlot[];
}

interface AvailabilityCalendarProps {
  onAvailabilityChange?: (availability: DayAvailability[]) => void;
  readOnly?: boolean;
  initialAvailability?: DayAvailability[];
}

export function AvailabilityCalendar({ 
  onAvailabilityChange,
  readOnly = false,
  initialAvailability = []
}: AvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availability, setAvailability] = useState<DayAvailability[]>(initialAvailability);
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({ start: '', end: '', rate: 0 });

  const getAvailabilityForDate = (date: Date) => {
    return availability.find(avail => 
      avail.date.toDateString() === date.toDateString()
    )?.slots || [];
  };

  const addTimeSlot = () => {
    if (!selectedDate || !newSlot.start || !newSlot.end || newSlot.rate <= 0) return;

    const existingDay = availability.find(avail => 
      avail.date.toDateString() === selectedDate.toDateString()
    );

    if (existingDay) {
      existingDay.slots.push(newSlot);
    } else {
      availability.push({
        date: selectedDate,
        slots: [newSlot]
      });
    }

    setAvailability([...availability]);
    onAvailabilityChange?.(availability);
    setNewSlot({ start: '', end: '', rate: 0 });
    setIsAddingSlot(false);
  };

  const removeTimeSlot = (date: Date, slotIndex: number) => {
    const dayAvail = availability.find(avail => 
      avail.date.toDateString() === date.toDateString()
    );
    
    if (dayAvail) {
      dayAvail.slots.splice(slotIndex, 1);
      if (dayAvail.slots.length === 0) {
        const dayIndex = availability.indexOf(dayAvail);
        availability.splice(dayIndex, 1);
      }
      setAvailability([...availability]);
      onAvailabilityChange?.(availability);
    }
  };

  const isDateAvailable = (date: Date) => {
    return availability.some(avail => 
      avail.date.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Calendrier de disponibilité
            </span>
            {!readOnly && selectedDate && (
              <Button 
                size="sm" 
                onClick={() => setIsAddingSlot(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter un créneau
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                modifiers={{
                  available: (date) => isDateAvailable(date)
                }}
                modifiersStyles={{
                  available: { 
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    fontWeight: 'bold'
                  }
                }}
                className="rounded-md border"
              />
              <div className="mt-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-200 rounded"></div>
                  <span>Jours avec disponibilités</span>
                </div>
              </div>
            </div>

            <div>
              {selectedDate && (
                <div>
                  <h3 className="font-medium mb-3">
                    Créneaux pour le {selectedDate.toLocaleDateString('fr-FR')}
                  </h3>
                  <div className="space-y-2">
                    {getAvailabilityForDate(selectedDate).map((slot, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">
                            {slot.start} - {slot.end}
                          </div>
                          <div className="text-sm text-green-600 font-medium">
                            {slot.rate}€/h
                          </div>
                        </div>
                        {!readOnly && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeTimeSlot(selectedDate, index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {getAvailabilityForDate(selectedDate).length === 0 && (
                      <div className="text-center py-6 text-gray-500">
                        Aucun créneau défini pour cette date
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog pour ajouter un créneau */}
      <Dialog open={isAddingSlot} onOpenChange={setIsAddingSlot}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Ajouter un créneau pour le {selectedDate?.toLocaleDateString('fr-FR')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Heure de début</label>
                <Input
                  type="time"
                  value={newSlot.start}
                  onChange={(e) => setNewSlot(prev => ({...prev, start: e.target.value}))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Heure de fin</label>
                <Input
                  type="time"
                  value={newSlot.end}
                  onChange={(e) => setNewSlot(prev => ({...prev, end: e.target.value}))}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tarif horaire (€)</label>
              <Input
                type="number"
                min="0"
                step="5"
                value={newSlot.rate || ''}
                onChange={(e) => setNewSlot(prev => ({...prev, rate: parseFloat(e.target.value) || 0}))}
                placeholder="65"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingSlot(false)}>
                Annuler
              </Button>
              <Button onClick={addTimeSlot} className="bg-green-600 hover:bg-green-700">
                Ajouter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
