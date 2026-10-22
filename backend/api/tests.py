# from django.contrib.auth import get_user_model
# from rest_framework.test import APITestCase


# class BensMoveisApiTests(APITestCase):
#     def setUp(self):
#         user_model = get_user_model()
#         self.user = user_model.objects.create_superuser(
#             username="admin",
#             email="admin@example.com",
#             password="test-password",
#         )
#         self.client.force_authenticate(user=self.user)

#     def test_create_uses_frontend_field_names(self):
#         response = self.client.post(
#             "/bens_moveis/",
#             {
#                 "numeroPatrimonio": "PAT-1000",
#                 "descricao": "Notebook",
#                 "localizacao": "Sala 1",
#                 "estado": "bom",
#                 "responsavel": "Coordenação",
#             },
#             format="json",
#         )

#         self.assertEqual(response.status_code, 201)
#         self.assertEqual(response.data["numeroPatrimonio"], "PAT-1000")
#         self.assertIn("id", response.data)
#         self.assertNotIn("codigoPatrimonio", response.data)

#     def test_update_and_delete_use_frontend_item_url(self):
#         from api.models import BensMoveis

#         item = BensMoveis.objects.create(
#             codigoPatrimonio="PAT-1001",
#             descricao="Notebook antigo",
#             localizacao="Sala 1",
#             estado="regular",
#             responsavel="Coordenação",
#         )

#         response = self.client.put(
#             f"/bens_moveis/{item.pk}/",
#             {
#                 "numeroPatrimonio": "PAT-1001",
#                 "descricao": "Notebook atualizado",
#                 "localizacao": "Sala 2",
#                 "estado": "bom",
#                 "responsavel": "Coordenação",
#             },
#             format="json",
#         )

#         self.assertEqual(response.status_code, 200)
#         item.refresh_from_db()
#         self.assertEqual(item.descricao, "Notebook atualizado")
#         self.assertEqual(item.localizacao, "Sala 2")

#         response = self.client.delete(f"/bens_moveis/{item.pk}/")

#         self.assertEqual(response.status_code, 204)
#         self.assertFalse(BensMoveis.objects.filter(pk=item.pk).exists())
