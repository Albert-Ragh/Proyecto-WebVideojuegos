<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Store;
use App\Models\User;
use App\Models\User_x_items;
use Illuminate\Support\Facades\DB;

class StoreController extends Controller
{
    public function createStoreItem(Request $request)
    {
        $store = new Store;
        $store->name = $request->name;
        $store->description = $request->description;
        $store->price = $request->price;
        $store->image_url = $request->image_url;
        $store->save();
    }

    public function getStoreItems()
    {
        $storeItems = Store::all();
        return $storeItems;
    }

    public function buyItems(Request $request)
    {
        $userId = $request->userId;
        $itemId = $request->itemId;

        // Obtener el usuario y el item
        $user = User::find($userId);
        $item = Store::find($itemId);

        // Verificar si el usuario tiene suficiente dinero
        if ($user->jeacstars < $item->price) {
            return response()->json(['message' => 'No tienes suficiente dinero para comprar este item'], 400);
        }

        // Restar el precio del item al dinero total del usuario
        $user->jeacstars -= $item->price;
        $user->save();

        // Guardar la información de la compra
        $purchase = new User_x_items;
        $purchase->userId = $userId;
        $purchase->itemId = $itemId;
        $purchase->save();

        return response()->json(['message' => 'Item comprado exitosamente'], 200);
    }

    public function sellItems(Request $request)
    {
        $userId = $request->userId;
        $itemId = $request->itemId;

        // Obtener el usuario y el item
        $user = User::find($userId);
        $item = Store::find($itemId);

        // Verificar si el usuario posee el item
        $purchase = User_x_items::where([
            ['userId', '=', $userId],
            ['itemId', '=', $itemId],
            ['avatar', '=', false]
        ])->first();
        if (!$purchase) {
            return response()->json(['message' => 'No posees este item o no puedes venderlo'], 400);
        }

        // Sumar el precio del item al dinero total del usuario
        $user->jeacstars += $item->price * 0.5;
        $user->save();

        // Eliminar la información de la compra
        DB::table('user_x_items')
            ->where('userId', $userId)
            ->where('itemId', $itemId)
            ->delete();

        return response()->json(['message' => 'Item vendido exitosamente'], 200);
    }

    public function getBoughtItems()
    {
        $items = User_x_items::all();
        return $items;
    }


    public function setAvatar(Request $request)
    {
        $userId = $request->userId;
        $itemId = $request->itemId;

        $items = User_x_items::where('userId', $userId)->where('itemId', $itemId)->get();

        foreach ($items as $item) {
            User_x_items::where('userId', $userId)
                ->where('itemId', $itemId)
                ->update(['avatar' => true]);

            User_x_items::where('userId', $userId)
                ->where('itemId', '<>', $itemId)
                ->update(['avatar' => false]);

            $item->save();
        }
    }

    public function setBGImage(Request $request)
    {
        $userId = $request->userId;
        $itemId = $request->itemId;

        $items = User_x_items::where('userId', $userId)->where('itemId', $itemId)->get();

        foreach ($items as $item) {
            User_x_items::where('userId', $userId)
                ->where('itemId', $itemId)
                ->update(['bgImage' => true]);

            User_x_items::where('userId', $userId)
                ->where('itemId', '<>', $itemId)
                ->update(['bgImage' => false]);

            $item->save();
        }
    }
}
