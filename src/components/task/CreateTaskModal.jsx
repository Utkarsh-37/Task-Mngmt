import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiX, FiLoader, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const schema = yup.object({
  title:       yup.string().required('Title is required'),
  description: yup.string(),
  priority:    yup.string().oneOf(['LOW','MEDIUM','HIGH','URGENT']).default('MEDIUM'),
  status:      yup.string().oneOf(['TODO','IN_PROGRESS','IN_REVIEW','DONE']).default('TODO'),
  dueDate:     yup.date().required('Due date is required').typeError('Invalid date'),
  assignedTo:  yup.string(),
}).required();

const FIELD_LABEL = { base:'text-[12px] font-semibold mb-1.5 block', style:{color:'var(--text-2)'} };

const FormField = ({ label, error, children }) => (
  <div>
    <label className={FIELD_LABEL.base} style={FIELD_LABEL.style}>{label}</label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{opacity:0, y:-4}} animate={{opacity:1, y:0}} exit={{opacity:0}}
          className="flex items-center gap-1 mt-1.5 text-[11px]"
          style={{color:'var(--danger)'}}
        >
          <FiAlertCircle size={11} /> {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const CreateTaskModal = ({ isOpen, onClose, onCreated }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { priority:'MEDIUM', status:'TODO' },
  });

  const onSubmit = async (data) => {
    try {
      await new Promise(res => setTimeout(res, 700));
      toast.success('Task created successfully');
      onCreated?.(data);
      reset();
      onClose();
    } catch {
      toast.error('Failed to create task');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="modal-backdrop"
            onClick={onClose}
          />
          <div className="modal-backdrop" style={{pointerEvents:'none', zIndex:501}}>
            <motion.div
              initial={{opacity:0, scale:.95, y:16}}
              animate={{opacity:1, scale:1, y:0}}
              exit={{opacity:0, scale:.95, y:16}}
              transition={{duration:.2}}
              className="modal-panel"
              style={{maxWidth:520, pointerEvents:'all', zIndex:501, position:'relative'}}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 shrink-0"
                style={{borderBottom:'1px solid var(--border)'}}>
                <div>
                  <h2 className="font-display font-bold text-[16px]" style={{color:'var(--text)'}}>
                    Create Task
                  </h2>
                  <p className="text-[12px]" style={{color:'var(--text-3)'}}>Fill in the details below</p>
                </div>
                <button className="btn-icon" onClick={onClose} aria-label="Close">
                  <FiX size={15} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
                <div className="p-6 space-y-4 overflow-y-auto flex-1">

                  <FormField label="Task Title *" error={errors.title?.message}>
                    <input
                      {...register('title')}
                      className={`input-base ${errors.title ? 'error' : ''}`}
                      placeholder="e.g., Update login redirect flow"
                    />
                  </FormField>

                  <FormField label="Description" error={errors.description?.message}>
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="input-base resize-none"
                      placeholder="Add more details about this task…"
                      style={{lineHeight:'1.6'}}
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Priority" error={errors.priority?.message}>
                      <select {...register('priority')} className="input-base" style={{cursor:'pointer'}}>
                        <option value="LOW">🟢 Low</option>
                        <option value="MEDIUM">🟡 Medium</option>
                        <option value="HIGH">🔴 High</option>
                        <option value="URGENT">⚡ Urgent</option>
                      </select>
                    </FormField>

                    <FormField label="Status" error={errors.status?.message}>
                      <select {...register('status')} className="input-base" style={{cursor:'pointer'}}>
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="DONE">Done</option>
                      </select>
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Due Date *" error={errors.dueDate?.message}>
                      <input
                        {...register('dueDate')}
                        type="date"
                        className={`input-base ${errors.dueDate ? 'error' : ''}`}
                        style={{colorScheme:'dark'}}
                      />
                    </FormField>

                    <FormField label="Assign To" error={errors.assignedTo?.message}>
                      <input
                        {...register('assignedTo')}
                        className="input-base"
                        placeholder="Team member name"
                      />
                    </FormField>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 shrink-0"
                  style={{borderTop:'1px solid var(--border)'}}>
                  <button type="button" onClick={onClose} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{minWidth:120, opacity: isSubmitting ? .7 : 1}}
                  >
                    {isSubmitting
                      ? <><FiLoader size={13} className="animate-spin-slow" /> Creating…</>
                      : '+ Create Task'
                    }
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateTaskModal;
