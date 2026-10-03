 ALTER TABLE public.feed_runs                                                                        
      ADD CONSTRAINT feed_runs_status_check                                                             
      CHECK (status IN ('running', 'success', 'failed'));