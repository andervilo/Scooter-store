import{db}from"@/lib/db";
export async function getVehicleHistory(companyId:string,vehicleId:string){
 const vehicle=await db.execute({sql:"SELECT id,brand,model,serial_number FROM vehicles WHERE id=? AND company_id=? LIMIT 1",args:[vehicleId,companyId]});if(!vehicle.rows.length)return null;
 const [orders,batteries]=await Promise.all([
  db.execute({sql:"SELECT id,number,status,problem_description,diagnosis,opened_at,completed_at,delivered_at,next_service_at,total FROM service_orders WHERE company_id=? AND vehicle_id=? ORDER BY opened_at DESC",args:[companyId,vehicleId]}),
  db.execute({sql:"SELECT id,technology,voltage,capacity_ah,manufacturer,serial_number,installed_at,removed_at,active FROM batteries WHERE company_id=? AND vehicle_id=? ORDER BY installed_at DESC,created_at DESC",args:[companyId,vehicleId]})
 ]);
 const orderIds=orders.rows.map(x=>String(x.id));let items:unknown[]=[];
 if(orderIds.length){const marks=orderIds.map(()=>"?").join(",");const r=await db.execute({sql:`SELECT service_order_id,type,description,quantity,unit_price,total_price FROM service_order_items WHERE service_order_id IN (${marks}) ORDER BY created_at`,args:orderIds});items=[...r.rows];}
 return{vehicle:vehicle.rows[0],orders:orders.rows.map(o=>({...o,items:items.filter((i:any)=>String(i.service_order_id)===String(o.id))})),batteries:batteries.rows};
}