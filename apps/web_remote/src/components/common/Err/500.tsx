export function ErrInternalserverError() {
  return <>INTERNAL SERVER ERROR</>;
}

export function ErrLoadModule() {
  return (
    <>
      <ErrInternalserverError />
      <div>ERROR LOAD MODULE</div>
    </>
  );
}
