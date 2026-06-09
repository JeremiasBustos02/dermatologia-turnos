-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE INDEX "Professional_deletedAt_idx" ON "Professional"("deletedAt");

-- CreateIndex
CREATE INDEX "MedicalRecord_patientId_createdAt_idx" ON "MedicalRecord"("patientId", "createdAt");

-- CreateIndex
CREATE INDEX "MedicalRecord_professionalId_createdAt_idx" ON "MedicalRecord"("professionalId", "createdAt");

-- CreateIndex
CREATE INDEX "Schedule_professionalId_dayOfWeek_idx" ON "Schedule"("professionalId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "Appointment_patientId_dateTime_idx" ON "Appointment"("patientId", "dateTime");
